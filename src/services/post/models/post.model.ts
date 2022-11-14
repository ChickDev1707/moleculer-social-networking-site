import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;
import { IPostDTO } from "../dtos/post.dto";

const postSchema = new Schema<IPostDTO>({
  content: {
    type: "String",
    default: "default content",
  },
  images: [{type: "String"}],
  likes: [{type: Schema.Types.ObjectId}],
  comments: [{type: Schema.Types.ObjectId}],
  user: {type: Schema.Types.ObjectId},
  createAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("posts", postSchema);
