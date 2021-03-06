import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const devicesSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://<portal>.hexnodemdm.com/api/v1/devices/
     * PATTERN: Fetch Entities
     */
    id: 'fetch-devices',
    name: 'Fetch Devices',
    entities: [
      {
        resourceName: 'Device',
        _type: 'hexnode_device',
        _class: ['Device'],
      },
    ],
    relationships: [
      {
        _type: 'hexnode_account_has_device',
        sourceType: 'hexnode_account',
        _class: RelationshipClass.HAS,
        targetType: 'hexnode_device',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: N/A
     * PATTERN: Build Relationships
     */
    id: 'build-devices-and-users-relationships',
    name: 'Build Devices and Users Relationships',
    entities: [],
    relationships: [
      {
        _type: 'hexnode_user_has_device',
        sourceType: 'hexnode_user',
        _class: RelationshipClass.HAS,
        targetType: 'hexnode_device',
      },
    ],
    dependsOn: ['fetch-users', 'fetch-devices'],
    implemented: true,
  },
];
