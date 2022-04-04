import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const usersSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://localhost/api/v1/users
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'hexnode_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'hexnode_account_has_user',
        sourceType: 'hexnode_account',
        _class: RelationshipClass.HAS,
        targetType: 'hexnode_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
