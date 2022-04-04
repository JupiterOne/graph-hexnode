import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { createDeviceEntity } from './converter';

export async function fetchDevices({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateDevices(async (device) => {
    const deviceEntity = createDeviceEntity(device);

    if (deviceEntity) {
      await jobState.addEntity(deviceEntity);

      const userEntity = await jobState.findEntity(
        `${device.user.name}-${device.user.id.toString()}`,
      );

      if (userEntity)
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: userEntity,
            to: deviceEntity,
          }),
        );
    }
  });
}

export const devicesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.DEVICE],
    relationships: [Relationships.USER_HAS_DEVICE],
    dependsOn: [Steps.USERS],
    executionHandler: fetchDevices,
  },
];
