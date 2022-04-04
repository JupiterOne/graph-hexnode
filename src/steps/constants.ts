import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
};

export const Entities: Record<'USER' | 'ACCOUNT', StepEntityMetadata> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'hexnode_account',
    _class: ['Account'],
  },
  USER: {
    resourceName: 'User',
    _type: 'hexnode_user',
    _class: ['User'],
  },
};
