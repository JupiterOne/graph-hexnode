import { accountSteps } from './account';
import { usersSteps } from './users';
import { userGroupsSteps } from './user-groups';
import { devicesSteps } from './devices';
import { deviceGroupsSteps } from './device-groups';

const integrationSteps = [
  ...accountSteps,
  ...usersSteps,
  ...userGroupsSteps,
  ...devicesSteps,
  ...deviceGroupsSteps,
];

export { integrationSteps };
