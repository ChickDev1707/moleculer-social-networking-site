import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;

export interface IPostDTO {
    content: string;
    images: string[];
    likes: string[];
    comments: Types.Array<Types.ObjectId>;
    user: string;
    createdAt: Date;
}
