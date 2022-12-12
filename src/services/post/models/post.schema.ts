import mongoose from "mongoose";
const { Schema } = mongoose;
import { IPostDTO } from "../dtos/post.dto";

const PostSchema = new Schema<IPostDTO>({
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
