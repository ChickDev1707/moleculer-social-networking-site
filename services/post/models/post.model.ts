import {Schema, model} from 'mongoose'

const postSchema = new Schema({
  title: String,
  content: String,
  // images: [{
  //   type: String,
  //   required: true
  // }],
  // likes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
  // comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
  // user: {type: mongoose.Types.ObjectId, ref: 'users'},
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {collection: 'posts'})
export default model('posts', postSchema)