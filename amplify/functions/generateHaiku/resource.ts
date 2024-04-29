import { defineFunction } from "@aws-amplify/backend";

export const MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0'

export const generateHaiku = defineFunction({
  entry: './handler.ts',
  name: 'generateHaiku',
  environment: {
    MODEL_ID: MODEL_ID
  }
})