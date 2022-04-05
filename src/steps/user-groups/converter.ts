import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { HexnodeUserGroup } from '../../types';

export function createUserGroupEntity(userGroup: HexnodeUserGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: userGroup,
      assign: {
        _type: Entities.USER_GROUP._type,
        _class: Entities.USER_GROUP._class,
        _key: `${userGroup.groupname}-${userGroup.id.toString()}`,
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
