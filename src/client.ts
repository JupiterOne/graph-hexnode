import { Response } from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  HexnodeUser,
  HexnodeUserGroup,
  HexnodeUserGroupDetail,
  HexnodeDevice,
  HexnodeDeviceGroupDetail,
  HexnodeDeviceGroup,
} from './types';
import { retry } from '@lifeomic/attempt';
import { fetchOrThrow } from './utils/helpers';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}
  private perPage = 100;
  private baseUri = `https://${this.config.hostname}/api/v1/`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;

  private async request(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<Response> {
    try {
      const options = {
        method,
        headers: {
          Authorization: this.config.apiKey,
        },
      };

      // Handle rate-limiting
      const response = await retry(
        async () => {
          return fetchOrThrow(uri, options);
        },
        {
          delay: 12000,
          factor: 1.5,
          maxAttempts: 5,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            )
              context.abort();
          },
        },
      );

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
        const response = await this.request(next || uri, method);

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
      await this.request(uri);
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
  public async iterateUserGroups(
    iteratee: ResourceIteratee<HexnodeUserGroup>,
  ): Promise<void> {
    await this.paginatedRequest<HexnodeUserGroup>(
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

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateDeviceGroups(
    iteratee: ResourceIteratee<HexnodeDeviceGroup>,
  ): Promise<void> {
    await this.paginatedRequest<HexnodeDeviceGroup>(
      this.withBaseUri(`devicegroups/?per_page=${this.perPage}`),
      'GET',
      iteratee,
    );
  }

  public async fetchUserGroupDetails(
    id: string,
  ): Promise<HexnodeUserGroupDetail> {
    return await this.request(this.withBaseUri(`usergroups/${id}/`));
  }

  public async fetchDeviceGroupDetails(
    id: string,
  ): Promise<HexnodeDeviceGroupDetail> {
    return await this.request(this.withBaseUri(`devicegroups/${id}/`));
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
