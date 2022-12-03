import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;
import { ICommentDTO } from "../dtos/comment.dto";
import posts from "./post.model";

const commentSchema = new Schema<ICommentDTO>({
    content: "string",
    tag: [{type: "String"}], // Ref users
    reply: [{type: Schema.Types.ObjectId, ref: "comments"}],
    parent: "string",
    likes: [{type: "String"}], // Ref users
    user: "string", // Ref users
    postId: {type: Schema.Types.ObjectId, ref: "posts"},
    postUserId: "string", // REf users
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
});

export default model("comments", commentSchema);
