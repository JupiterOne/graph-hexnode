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

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity,
          to: deviceEntity,
        }),
      );

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
    relationships: [
      Relationships.USER_HAS_DEVICE,
      Relationships.ACCOUNT_HAS_DEVICE,
    ],
    dependsOn: [Steps.USERS, Steps.ACCOUNT],
    executionHandler: fetchDevices,
  },
];
