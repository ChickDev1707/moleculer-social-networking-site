import { Types } from "mongoose";
import { UserModel } from "../../user/types/models";

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
	members: UserModel.User[];
	detailMembers: UserModel.User[];
	avatar?: string;
	updatedAt: Date;
	createdAt: Date;
	createdBy: string;
}
