import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;

export interface IConversationDTO {
	name?: string;
	members: Types.Array<string>;
	avatar?: string;
	updatedAt?: Date;
	createdAt?: Date;
	createdBy: string;
}

export interface IConversationOf2 {
	userId1: string;
	userId2?: string;
}

export interface IMemberDTO {
	conversation: Types.ObjectId;
	member: string;
}

export interface IResConversation {
	_id: Types.ObjectId;
	name: string;
	members: IUserInfo[];
	detailMembers: IUserInfo[];
	avatar?: string;
	updatedAt: Date;
	createdAt: Date;
	createdBy: string;
}

export interface IUserInfo {
	id: string;
	name: string;
	avatar?: string;
}
