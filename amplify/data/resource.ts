import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const cursorType = {
  roomId: a.string().required(),
  x: a.integer().required(),
  y: a.integer().required(),
  username: a.string().required()
}

const schema = a.schema({
  Room: a.model({
    topic: a.string(),
  }),

  Cursor: a.customType(cursorType),

  publishCursor: a.mutation()
    .arguments(cursorType)
    .returns(a.ref('Cursor'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.custom({
      entry: './publishCursor.js',
    })),
  
  subscribeCursor: a.subscription()
    .for(a.ref('publishCursor'))
    .arguments({ roomId: a.string(), myUsername: a.string() })
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.custom({
      entry: './subscribeCursor.js'
    })),

}).authorization((allow) => [allow.authenticated()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});