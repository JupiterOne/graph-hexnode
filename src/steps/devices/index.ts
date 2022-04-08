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
import { getUserKey } from '../users/converter';
import { createDeviceEntity } from './converter';

export async function fetchDevices({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateDevices(async (device) => {
    const deviceEntity = createDeviceEntity(device);

    await jobState.addEntity(deviceEntity);
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: deviceEntity,
      }),
    );
  });
}

export async function buildDeviceAndUserRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.DEVICE._type },
    async (deviceEntity) => {
      const userEntity = await jobState.findEntity(
        getUserKey(deviceEntity.userId as number),
      );

      if (userEntity)
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: userEntity,
            to: deviceEntity,
          }),
        );
    },
  );
}

export const devicesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.DEVICE],
    relationships: [Relationships.ACCOUNT_HAS_DEVICE],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchDevices,
  },
  {
    id: Steps.BUILD_DEVICES_AND_USERS_RELATIONSHIPS,
    name: 'Build Devices and Users Relationships',
    entities: [],
    relationships: [Relationships.USER_HAS_DEVICE],
    dependsOn: [Steps.USERS, Steps.DEVICES],
    executionHandler: buildDeviceAndUserRelationships,
  },
];
