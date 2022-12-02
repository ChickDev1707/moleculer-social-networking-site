import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;
import { ICommentDTO } from "../dtos/comment.dto";
import posts from "./post.model";

const commentSchema = new Schema<ICommentDTO>({
    content: "string",
    tag: [{type: Schema.Types.ObjectId}], // Ref users
    reply: [{type: Schema.Types.ObjectId, ref: "comments"}],
    parent: "string",
    likes: [{type: Schema.Types.ObjectId}], // Ref users
    user: {type: Schema.Types.ObjectId}, // Ref users
    postId: {type: Schema.Types.ObjectId, ref: "posts"},
    postUserId: {type: Schema.Types.ObjectId}, // REf users
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
