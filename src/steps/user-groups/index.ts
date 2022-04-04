import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { createGroupEntity } from './converter';

export async function fetchGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateGroups(async (group) => {
    const groupEntity = createGroupEntity(group);
    if (groupEntity) {
      await jobState.addEntity(groupEntity);

      const groupDetail = await apiClient.fetchUserGroupDetails(
        groupEntity.id as string,
      );

      for (const user of groupDetail.users) {
        const userEntity = await jobState.findEntity(
          `${user.name}-${user.id.toString()}`,
        );

        if (userEntity)
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: groupEntity,
              to: userEntity,
            }),
          );
      }
    }
  });
}

export const userGroupsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.GROUPS,
    name: 'Fetch Groups',
    entities: [Entities.GROUP],
    relationships: [Relationships.GROUP_HAS_USER],
    dependsOn: [Steps.USERS],
    executionHandler: fetchGroups,
  },
];
