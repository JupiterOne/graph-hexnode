import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { HexnodeGroup } from '../../types';

export function createGroupEntity(group: HexnodeGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: group,
      assign: {
        _type: Entities.GROUP._type,
        _class: Entities.GROUP._class,
        _key: `${group.groupname}-${group.id.toString()}`,
        id: group.id.toString(),
        name: group.groupname,
        groupName: group.groupname,
        description: group.description,
        usersCount: group.users_count,
        modifiedDate: group.modified_date,
      },
    },
  });
}
