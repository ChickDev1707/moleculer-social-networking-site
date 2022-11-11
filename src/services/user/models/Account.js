module.exports = {
  id: {
    type: "uuid",
    primary: true,
  },
  username: {
    type: "string",
    unique: true,
  },
  password: {
    type: "string",
  },
};
