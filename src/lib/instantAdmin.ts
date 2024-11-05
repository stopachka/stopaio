import { init_experimental } from "@instantdb/admin";
import graph from "../../instant.schema";

const adminDB = init_experimental({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
  schema: graph,
});

export default adminDB;
