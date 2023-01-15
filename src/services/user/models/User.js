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
    default: "",
  },
  avatar: {
    type: "string",
    default: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg",
  },
  followers: {
    type: "number",
    default: 0,
  },
  followings: {
    type: "number",
    default: 0,
  },
};
