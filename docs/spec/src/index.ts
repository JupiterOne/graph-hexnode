import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { usersSpec } from './users';
import { accountSpec } from './account';
import { devicesSpec } from './devices';
import { userGroupsSpec } from './user-groups';
import { deviceGroupsSpec } from './device-groups';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...usersSpec,
    ...devicesSpec,
    ...userGroupsSpec,
    ...deviceGroupsSpec,
  ],
};
