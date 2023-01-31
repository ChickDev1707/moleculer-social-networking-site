module.exports = {
  id: {
    type: "uuid",
    primary: true,
  },
  name: {
    type: "string",
    required: true,
  },
  gender: {
    type: "string",
    required: true,
  },
  dateOfBirth: {
    type: "date",
    required: true,
  },
  email: {
    type: "string",
  },
  phoneNumber: {
    type: "string",
  },
  address: {
    type: "string",
  },
  avatar: {
    type: "string",
  },
  followers: {
    type: "string",
  },
  followings: {
    type: "string",
  },
};
