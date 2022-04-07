import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { HexnodeUserGroup } from '../../types';

export function getUserGroupKey(id: number): string {
  return `hexnode_user_group:${id.toString()}`;
}

export function createUserGroupEntity(userGroup: HexnodeUserGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: userGroup,
      assign: {
        _type: Entities.USER_GROUP._type,
        _class: Entities.USER_GROUP._class,
        _key: getUserGroupKey(userGroup.id),
        id: userGroup.id.toString(),
        name: userGroup.groupname,
        groupName: userGroup.groupname,
        description: userGroup.description,
        usersCount: userGroup.users_count,
        modifiedDate: userGroup.modified_date,
      },
    },
  });
}
