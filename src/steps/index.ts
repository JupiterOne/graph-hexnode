import { accountSteps } from './account';
import { usersSteps } from './users';
import { userGroupsSteps } from './user-groups';

const integrationSteps = [...accountSteps, ...usersSteps, ...userGroupsSteps];

export { integrationSteps };
