import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getAccountKey(user: string): string {
  return `hexnode_account:${user}`;
}

export function createAccountEntity(account: {
  email: string;
  hostname: string;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        _key: getAccountKey(account.email),
        email: account.email,
        hostname: account.hostname,
        name: account.email,
      },
    },
  });
}
