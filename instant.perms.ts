const rules = {
  $default: {
    allow: {
      default: "false",
    },
  },
  posts: {
    bind: ["isAdmin", "auth.email == 'stepan.p@gmail.com'"],
    allow: {
      view: "true",
      create: "isAdmin",
      delete: "isAdmin",
      update: "isAdmin",
    },
  },
  postBodies: {
    bind: ["isAdmin", "auth.email == 'stepan.p@gmail.com'"],
    allow: {
      view: "true",
      create: "isAdmin",
      delete: "isAdmin",
      update: "isAdmin",
    },
  },
};

export default rules;
