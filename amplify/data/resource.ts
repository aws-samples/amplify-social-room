import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { generateHaiku } from '../functions/generateHaiku/resource';

const cursorType = {
  roomId: a.string().required(),
  x: a.integer().required(),
  y: a.integer().required(),
  username: a.string().required()
}

const schema = a.schema({
  Room: a.model({
    topic: a.string(),
    pictures: a.hasMany('Picture', 'roomId')
  }),

  Picture: a.model({
    path: a.string().required(),
    roomId: a.string().required(),
    room: a.belongsTo('Room', 'roomId')
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

  Haiku: a.customType({
    content: a.string().required(),
    roomId: a.id().required()
  }),
  
  generateHaiku: a.mutation()
    .arguments({ roomId: a.string().required() })
    .returns(a.ref('Haiku'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(generateHaiku)),

  onGenerateHaiku: a.subscription()
    .arguments({ roomId: a.string().required() })
    .for(a.ref('generateHaiku'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.custom({
      entry: './onGenerateHaiku.js'
    }))

}).authorization((allow) => [allow.authenticated()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});