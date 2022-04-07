import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  ACCOUNT_ENTITY_KEY,
  Entities,
  Relationships,
  Steps,
} from '../constants';
import { getDeviceKey } from '../devices/converter';
import { createDeviceGroupEntity } from './converter';

export async function fetchDeviceGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateDeviceGroups(async (deviceGroup) => {
    const deviceGroupEntity = createDeviceGroupEntity(deviceGroup);

    await jobState.addEntity(deviceGroupEntity);

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: deviceGroupEntity,
      }),
    );
  });
}

export async function buildDeviceGroupsAndDevicesRelationships({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.DEVICE_GROUP._type },
    async (deviceGroupEntity) => {
      const deviceGroupDetails = await apiClient.fetchDeviceGroupDetails(
        deviceGroupEntity.id as string,
      );

      if (deviceGroupDetails.devices)
        for (const device of deviceGroupDetails.devices) {
          const deviceEntity = await jobState.findEntity(
            getDeviceKey(device.id),
          );

          if (deviceEntity)
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: deviceGroupEntity,
                to: deviceEntity,
              }),
            );
        }
    },
  );
}

export const deviceGroupsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICE_GROUPS,
    name: 'Fetch Device Groups',
    entities: [Entities.DEVICE_GROUP],
    relationships: [Relationships.ACCOUNT_HAS_DEVICE_GROUP],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchDeviceGroups,
  },
  {
    id: Steps.BUILD_DEVICE_GROUPS_DEVICES_RELATIONSHIPS,
    name: 'Build Device Groups and Devices Relationships',
    entities: [],
    relationships: [Relationships.DEVICE_GROUP_HAS_DEVICE],
    dependsOn: [Steps.DEVICES, Steps.DEVICE_GROUPS],
    executionHandler: buildDeviceGroupsAndDevicesRelationships,
  },
];
