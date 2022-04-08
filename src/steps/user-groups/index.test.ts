import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-user-groups', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-user-groups',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.USER_GROUPS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-user-groups-and-users-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-user-groups-and-users-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_USER_GROUPS_USERS_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
