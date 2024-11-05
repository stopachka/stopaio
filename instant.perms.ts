const rules = {
  attrs: {
    allow: {
      create: "false",
    },
  },
  posts: {
    bind: ["isAdmin", "auth.email == 'stepan.p@gmail.com'"],
    allow: {
      create: "isAdmin",
      delete: "isAdmin",
      update: "isAdmin",
    },
  },
  postBodies: {
    bind: ["isAdmin", "auth.email == 'stepan.p@gmail.com'"],
    allow: {
      create: "isAdmin",
      delete: "isAdmin",
      update: "isAdmin",
    },
  },
};

export default rules;
