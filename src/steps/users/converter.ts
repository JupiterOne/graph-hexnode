import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { HexnodeUser } from '../../types';

export function getUserKey(id: number): string {
  return `hexnode_user:${id.toString()}`;
}

export function createUserEntity(user: HexnodeUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.id),
        id: user.id.toString(),
        username: user.name,
        email: user.email || undefined,
        active: true,
        phoneno: user?.phoneno,
        totalDevices: user.total_devices,
        domain: user.domain,
      },
    },
  });
}
