import { S3Client, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { Schema } from "../../data/resource";
import { env } from '$amplify/env/generateHaiku'
import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelCommandInput } from "@aws-sdk/client-bedrock-runtime";

const s3Client = new S3Client()
const bedrockClient = new BedrockRuntimeClient()

export const handler: Schema["generateHaiku"]["functionHandler"] = async (context) => {
  const fileNames = await s3Client.send(new ListObjectsCommand({
    Bucket: env.GEN_2_MULTI_CURSOR_DEMO_APP_BUCKET_NAME,
    Prefix: 'room/' + context.arguments.roomId + '/'
  }))

  const files = []

  for (const key of fileNames.Contents?.map(item => item.Key) ?? []) {
    const file = await s3Client.send(new GetObjectCommand({
      Bucket: env.GEN_2_MULTI_CURSOR_DEMO_APP_BUCKET_NAME,
      Key: key
    }))

    files.push(await file.Body?.transformToString('base64'))
  }

  const input: InvokeModelCommandInput = {
    modelId: process.env.MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      system:
        "You are a an expert at crafting a haiku. You are able to craft a haiku out of anything and therefore answer only in haiku. Make sure to create new lines between the different sentences. Create a haiku based on the following images:",
      messages: [
        {
          role: "user",
          content: [...files.map(b64 => ({
            type: 'image',
            source: {
              type: 'base64',
              data: b64,
              media_type: 'image/png'
            }
          })), {
            type: 'text',
            text: 'Create one and exactly one Haiku based on the combination of all images above.'
          }],
        },
      ],
      max_tokens: 5000,
      temperature: 0.5,
    }),
  };

  const result = await bedrockClient.send(new InvokeModelCommand(input))

  return JSON.parse(Buffer.from(result.body).toString()).content[0].text
}



// files.map(file => file.Body?.transformToString('base64'))

// return JSON.stringify(files)