import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { MODEL_ID, generateHaiku } from './functions/generateHaiku/resource';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  generateHaiku
});

backend.storage.resources.cfnResources.cfnBucket.lifecycleConfiguration = {
  rules: [{
    expirationInDays: 1,
    prefix: 'room/',
    status: 'Enabled'
  }]
}

backend.generateHaiku.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:${Stack.of(backend.data).region}::foundation-model/${MODEL_ID}`,
    ],
  })
)
