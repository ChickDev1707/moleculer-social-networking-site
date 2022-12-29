import mongoose from "mongoose";
const { Schema } = mongoose;
import { IPost } from "../entities/post.entity";

const PostSchema = new Schema<IPost>({
  content: {
    type: "String",
    default: "default content",
  },
  images: [{type: "String"}],
  likes: [{type: "String"}],
  comments: [{type: Schema.Types.ObjectId}],
  user: {
    type: "String",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default PostSchema;
