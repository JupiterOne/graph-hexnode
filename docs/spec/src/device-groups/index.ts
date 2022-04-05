import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const deviceGroupsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://<portal>.hexnodemdm.com/api/v1/devicegroups/
     * PATTERN: Fetch Entities
     */
    id: 'fetch-device-groups',
    name: 'Fetch Device Groups',
    entities: [
      {
        resourceName: 'Device Group',
        _type: 'hexnode_device_group',
        _class: ['Group'],
      },
    ],
    relationships: [
      {
        _type: 'hexnode_account_has_device_group',
        sourceType: 'hexnode_account',
        _class: RelationshipClass.HAS,
        targetType: 'hexnode_device_group',
      },
    ],
    dependsOn: ['fetch-devices', 'fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT:https://<portal>.hexnodemdm.com/api/v1/devicegroups/{DEVICEGROUP_ID}/
     * PATTERN: Build Relationships
     */
    id: 'build-device-groups-and-devices-relationships',
    name: 'Build Device Groups and Devices Relationships',
    entities: [],
    relationships: [
      {
        _type: 'hexnode_device_group_has_device',
        sourceType: 'hexnode_device_group',
        _class: RelationshipClass.HAS,
        targetType: 'hexnode_device',
      },
    ],
    dependsOn: ['fetch-devices', 'fetch-device-groups'],
    implemented: true,
  },
];
