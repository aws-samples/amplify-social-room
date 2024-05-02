import { defineStorage } from "@aws-amplify/backend";
import { generateHaiku } from "../functions/generateHaiku/resource";

export const storage = defineStorage({
  name: 'gen2-multi-cursor-demo-app',
  access: allow => ({
    'room/*': [
      allow.authenticated.to(['get', 'write', 'delete']),
      allow.guest.to(['get']),
      allow.resource(generateHaiku).to(['read'])
    ]
  })
});