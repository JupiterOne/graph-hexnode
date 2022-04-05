import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  USER_GROUPS: 'fetch-user-groups',
  DEVICES: 'fetch-devices',
  DEVICE_GROUPS: 'fetch-device-groups',
};

export const Entities: Record<
  'USER' | 'ACCOUNT' | 'USER_GROUP' | 'DEVICE' | 'DEVICE_GROUP',
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
  USER_GROUP: {
    resourceName: 'User Group',
    _type: 'hexnode_user_group',
    _class: ['Group'],
  },
  DEVICE: {
    resourceName: 'Device',
    _type: 'hexnode_device',
    _class: ['Device'],
  },
  DEVICE_GROUP: {
    resourceName: 'Device Group',
    _type: 'hexnode_device_group',
    _class: ['Group'],
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_USER' | 'USER_GROUP_HAS_USER' | 'USER_HAS_DEVICE',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'hexnode_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  USER_GROUP_HAS_USER: {
    _type: 'hexnode_user_group_has_user',
    sourceType: Entities.USER_GROUP._type,
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
