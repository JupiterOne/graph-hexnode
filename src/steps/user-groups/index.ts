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
import { createUserGroupEntity } from './converter';

export async function fetchUserGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateUserGroups(async (userGroup) => {
    const userGroupEntity = createUserGroupEntity(userGroup);
    if (userGroupEntity) {
      await jobState.addEntity(userGroupEntity);

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity,
          to: userGroupEntity,
        }),
      );

      const groupDetail = await apiClient.fetchUserGroupDetails(
        userGroupEntity.id as string,
      );

      for (const user of groupDetail.users) {
        const userEntity = await jobState.findEntity(
          `${user.name}-${user.id.toString()}`,
        );

        if (userEntity)
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: userGroupEntity,
              to: userEntity,
            }),
          );
      }
    }
  });
}

export const userGroupsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USER_GROUPS,
    name: 'Fetch User Groups',
    entities: [Entities.USER_GROUP],
    relationships: [
      Relationships.USER_GROUP_HAS_USER,
      Relationships.ACCOUNT_HAS_USER_GROUP,
    ],
    dependsOn: [Steps.USERS, Steps.ACCOUNT],
    executionHandler: fetchUserGroups,
  },
];
