import { init } from "@instantdb/react/nextjs";
import schema from "@/instant.schema";

const clientDB = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema: schema,
  useDateObjects: true,
  cookieEndpoint: "/api/instant",
  apiURI: "http://localhost:8888",
  websocketURI: "ws://localhost:8888/runtime/session",
});

export default clientDB;
