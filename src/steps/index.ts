import { accountSteps } from './account';
import { usersSteps } from './users';
import { userGroupsSteps } from './user-groups';
import { devicesSteps } from './devices';

const integrationSteps = [
  ...accountSteps,
  ...usersSteps,
  ...userGroupsSteps,
  ...devicesSteps,
];

export { integrationSteps };
