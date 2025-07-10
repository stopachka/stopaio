import { i } from "@instantdb/react";

const schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    postBodies: i.entity({
      markdown: i.string(),
    }),
    posts: i.entity({
      createdAt: i.number(),
      number: i.number(),
      title: i.string(),
      updatedAt: i.number(),
    }),
  },
  links: {
    postsBody: {
      forward: { on: "posts", has: "one", label: "body" },
      reverse: { on: "postBodies", has: "one", label: "post" },
    },
  },
  rooms: {
    pages: { presence: i.entity({}) },
  },
});

export default schema;
