import {Schema, model} from "mongoose";

const postSchema = new Schema({
  title: String,
  content: String,
  // Images: [{
  //   Type: String,
  //   Required: true
  // }],
  // Likes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
  // Comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
  // User: {type: mongoose.Types.ObjectId, ref: 'users'},
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {collection: "posts"});
export default model("posts", postSchema);
