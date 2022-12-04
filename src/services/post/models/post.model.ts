import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;
import { IPostDTO } from "../dtos/post.dto";

const postSchema = new Schema<IPostDTO>({
  content: {
    type: "String",
    default: "default content",
  },
  images: [{type: "String"}],
  likes: [{type: "String"}],
  comments: [{type: Schema.Types.ObjectId}],
  userId: "string",
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("posts", postSchema);
