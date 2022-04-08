import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userGroupsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://<portal>.hexnodemdm.com/api/v1/usergroups/
     * PATTERN: Fetch Entities
     */
    id: 'fetch-user-groups',
    name: 'Fetch User Groups',
    entities: [
      {
        resourceName: 'User Group',
        _type: 'hexnode_user_group',
        _class: ['Group'],
      },
    ],
    relationships: [
      {
        _type: 'hexnode_account_has_user_group',
        sourceType: 'hexnode_account',
        _class: RelationshipClass.HAS,
        targetType: 'hexnode_user_group',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT:https://<portal>.hexnodemdm.com/api/v1/usergroups/{USERGROUP_ID}/
     * PATTERN: Build Relationships
     */
    id: 'build-user-groups-and-users-relationships',
    name: 'Build User Groups and Users Relationships',
    entities: [],
    relationships: [
      {
        _type: 'hexnode_user_group_has_user',
        sourceType: 'hexnode_user_group',
        _class: RelationshipClass.HAS,
        targetType: 'hexnode_user',
      },
    ],
    dependsOn: ['fetch-users', 'fetch-user-groups'],
    implemented: true,
  },
];
