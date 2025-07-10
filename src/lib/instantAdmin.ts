import { init } from "@instantdb/admin";
import schema from "../../instant.schema";

const adminDB = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
  schema: schema,
});

export default adminDB;
