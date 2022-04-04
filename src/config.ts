import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  apiKey: {
    type: 'string',
    mask: true,
  },
  hostname: {
    type: 'string',
  },
  email: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  apiKey: string;
  hostname: string;
  email: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.apiKey || !config.hostname || !config.email) {
    throw new IntegrationValidationError(
      'Config requires all of { apiKey, hostname, email }',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
