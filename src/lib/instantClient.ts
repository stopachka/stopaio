import { init } from "@instantdb/react";
import schema from "../../instant.schema";

const clientDB = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema: schema,
});

export default clientDB;
