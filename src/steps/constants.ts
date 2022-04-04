import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  GROUPS: 'fetch-groups',
  DEVICES: 'fetch-devices',
};

export const Entities: Record<
  'USER' | 'ACCOUNT' | 'GROUP' | 'DEVICE',
  StepEntityMetadata
> = {
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
  GROUP: {
    resourceName: 'Group',
    _type: 'hexnode_user_group',
    _class: ['Group'],
  },
  DEVICE: {
    resourceName: 'Device',
    _type: 'hexnode_device',
    _class: ['Device'],
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_USER' | 'GROUP_HAS_USER' | 'USER_HAS_DEVICE',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'hexnode_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  GROUP_HAS_USER: {
    _type: 'hexnode_user_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  USER_HAS_DEVICE: {
    _type: 'hexnode_user_has_device',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DEVICE._type,
  },
};
