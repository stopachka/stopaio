import { init_experimental } from "@instantdb/react";
import schema from "../../instant.schema";

const clientDB = init_experimental({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema: schema.withRoomSchema<{ pages: { presence: {} } }>(),
});

export default clientDB;
