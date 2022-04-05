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
    const deviceEntity = createDeviceGroupEntity(deviceGroup);

    if (deviceEntity) {
      await jobState.addEntity(deviceEntity);
    }
  });
}

export const deviceGroupsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICE_GROUPS,
    name: 'Fetch Device Groups',
    entities: [Entities.DEVICE_GROUP],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchDeviceGroups,
  },
];
