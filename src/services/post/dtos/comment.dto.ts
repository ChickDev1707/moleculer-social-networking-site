import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;

export interface ICommentDTO {
	content: string;
	tag: string[];
	reply: Types.Array<Types.ObjectId>;
	parent: string;
	likes: string[];
	user: string;
	postId: Types.ObjectId;
	postUserId: string;
	createdAt: Date;
	modifiedAt: Date;
}
