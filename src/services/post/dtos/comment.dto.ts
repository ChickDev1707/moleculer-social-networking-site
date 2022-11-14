import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;

export interface ICommentDTO {
    content: string;
    tag: Types.Array<Types.ObjectId>;
    reply: Types.Array<Types.ObjectId>;
    parent: string;
    likes: Types.Array<Types.ObjectId>;
    user: Types.ObjectId;
    postId: Types.ObjectId;
    postUserId: Types.ObjectId;
    createAt: Date;
    modifiedAt: Date;
}
