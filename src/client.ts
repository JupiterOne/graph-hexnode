import fetch from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { HexnodeUserResponse, HexnodeUser } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}
  private baseUri = `https://${this.config.hostname}/api/v1/`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}/`;

  private async request<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
    retries: number = 1,
    backoffTime: number = 5,
  ): Promise<T> {
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

  public async verifyAuthentication(): Promise<void> {
    try {
      await this.request<HexnodeUserResponse>(this.withBaseUri('users'));
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: this.withBaseUri('users'),
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
    const { results } = await this.request<HexnodeUserResponse>(
      this.withBaseUri('users'),
    );

    for (const user of results) {
      await iteratee(user);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
