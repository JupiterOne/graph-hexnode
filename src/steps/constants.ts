import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

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

export const Relationships: Record<
  'ACCOUNT_HAS_USER',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'hexnode_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
};
