import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { createDeviceGroupEntity } from './converter';

export async function fetchDeviceGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateDeviceGroups(async (deviceGroup) => {
    const deviceGroupEntity = createDeviceGroupEntity(deviceGroup);

    if (deviceGroupEntity) {
      await jobState.addEntity(deviceGroupEntity);

      const deviceGroupDetails = await apiClient.fetchDeviceGroupDetails(
        deviceGroupEntity.id as string,
      );

      if (deviceGroupDetails.devices)
        for (const device of deviceGroupDetails.devices) {
          const deviceEntity = await jobState.findEntity(
            `${device.name}-${device.id}`,
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
    }
  });
}

export const deviceGroupsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICE_GROUPS,
    name: 'Fetch Device Groups',
    entities: [Entities.DEVICE_GROUP],
    relationships: [Relationships.DEVICE_GROUP_HAS_DEVICE],
    dependsOn: [Steps.DEVICES],
    executionHandler: fetchDeviceGroups,
  },
];
