import { createInstantRouteHandler } from "@instantdb/core";

export const { GET, POST } = createInstantRouteHandler({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
});
