import { accountSteps } from './account';
import { usersSteps } from './users';

const integrationSteps = [...accountSteps, ...usersSteps];

export { integrationSteps };
