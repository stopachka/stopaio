import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    postBodies: i.entity({
      markdown: i.string(),
    }),
    posts: i.entity({
      createdAt: i.number(),
      isDraft: i.boolean().optional(),
      number: i.number(),
      title: i.string(),
      updatedAt: i.number(),
    }),
  },
  links: {
    postsBody: {
      forward: {
        on: "posts",
        has: "one",
        label: "body",
      },
      reverse: {
        on: "postBodies",
        has: "one",
        label: "post",
      },
    },
  },
  rooms: {
    pages: {
      presence: i.entity({}),
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
