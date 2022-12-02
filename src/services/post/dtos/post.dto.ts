import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;

export interface IPostDTO {
    content: string;
    images: string[];
    likes: Types.Array<Types.ObjectId>;
    comments: Types.Array<Types.ObjectId>;
    user: Types.ObjectId;
    createdAt: Date;
}
