import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;
import { ICommentDTO } from "../dtos/comment.dto";

const commentSchema = new Schema<ICommentDTO>({
    content: "string",
    tag: [{type: Schema.Types.ObjectId}],
    reply: [{type: Schema.Types.ObjectId}],
    parent: "string",
    likes: [{type: Schema.Types.ObjectId}],
    user: {type: Schema.Types.ObjectId},
    postId: {type: Schema.Types.ObjectId},
    postUserId: {type: Schema.Types.ObjectId},
    createAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
});

export default model("comments", commentSchema);
