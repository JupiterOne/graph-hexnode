import fetch from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  HexnodeUserResponse,
  HexnodeUser,
  HexnodeGroup,
  HexnodeGroupDetail,
  HexnodeDevice,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}
  private perPage = 100;
  private baseUri = `https://${this.config.hostname}/api/v1/`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;

  private async request<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<any> {
    try {
      const options = {
        method,
        headers: {
          Authorization: this.config.apiKey,
        },
      };
      const response = await fetch(uri, options);

      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async paginatedRequest<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    try {
      let next = null;
      do {
        const response = await this.request<T>(next || uri, method);

        for (const result of response.results) await iteratee(result);
        next = response.next;
      } while (next);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: uri,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri('users/');
    try {
      await this.request<HexnodeUserResponse>(uri);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<HexnodeUser>,
  ): Promise<void> {
    await this.paginatedRequest<HexnodeUser>(
      this.withBaseUri(`users/?per_page=${this.perPage}`),
      'GET',
      iteratee,
    );
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroups(
    iteratee: ResourceIteratee<HexnodeGroup>,
  ): Promise<void> {
    await this.paginatedRequest<HexnodeGroup>(
      this.withBaseUri(`usergroups/?per_page=${this.perPage}`),
      'GET',
      iteratee,
    );
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateDevices(
    iteratee: ResourceIteratee<HexnodeDevice>,
  ): Promise<void> {
    await this.paginatedRequest<HexnodeDevice>(
      this.withBaseUri(`devices/?per_page=${this.perPage}`),
      'GET',
      iteratee,
    );
  }

  public async fetchUserGroupDetails(id: string): Promise<HexnodeGroupDetail> {
    return await this.request<HexnodeGroupDetail>(
      this.withBaseUri(`usergroups/${id}/`),
    );
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
