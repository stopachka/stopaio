import { init_experimental } from "@instantdb/react";
import graph from "../../instant.schema";

const clientDB = init_experimental({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema: graph.withRoomSchema<{ pages: { presence: {} } }>(),
});

export default clientDB;
