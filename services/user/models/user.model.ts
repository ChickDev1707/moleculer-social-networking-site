const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const posts = require('../model/postModel')

const userSchema = new Schema({
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/wjbucloud/image/upload/v1651308418/default_svymth.png',
  },
  gender: {
    type: String,
    default: '',
  },
  dateofbirth: {
    type: Date,
    default: '',
  },
  role: {
    type: String,
    default: 'male',
  },
  mobile: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  followers: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
  following: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('users', userSchema);