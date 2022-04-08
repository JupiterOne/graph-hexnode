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
import { createUserGroupEntity } from './converter';

export async function fetchUserGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateUserGroups(async (userGroup) => {
    const userGroupEntity = createUserGroupEntity(userGroup);
    await jobState.addEntity(userGroupEntity);

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: userGroupEntity,
      }),
    );
  });
}

export async function buildUserGroupsAndUserRelationships({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.USER_GROUP._type },
    async (userGroupEntity) => {
      const userGroupDetail = await apiClient.fetchUserGroupDetails(
        userGroupEntity.id as string,
      );

      for (const user of userGroupDetail.users) {
        const userEntity = await jobState.findEntity(getUserKey(user.id));

        if (userEntity)
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: userGroupEntity,
              to: userEntity,
            }),
          );
      }
    },
  );
}

export const userGroupsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USER_GROUPS,
    name: 'Fetch User Groups',
    entities: [Entities.USER_GROUP],
    relationships: [Relationships.ACCOUNT_HAS_USER_GROUP],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUserGroups,
  },
  {
    id: Steps.BUILD_USER_GROUPS_USERS_RELATIONSHIPS,
    name: 'Build User Groups and Users Relationships',
    entities: [],
    relationships: [Relationships.USER_GROUP_HAS_USER],
    dependsOn: [Steps.USERS, Steps.USER_GROUPS],
    executionHandler: buildUserGroupsAndUserRelationships,
  },
];
