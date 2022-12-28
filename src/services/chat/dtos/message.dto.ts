import { Types } from "mongoose";
import { UserModel } from "../../user/types/models";
import { TypeMessage } from "../enums/type-message.enum";
import { IResConversation } from "./conversation.dto";

export interface IMessageDTO {
	type: TypeMessage;
	conversation: Types.ObjectId;
	sender: string;
	content: string;
	isDeleted: boolean;
	seenBy: [string];
	reactBy: [string];
	updatedAt: Date;
	createdAt: Date;
}

export interface INewMessageDTO {
	conversation: Types.ObjectId;
	sender: string;
	content: string;
}

export interface IAnonymousMessageDTO {
	conversation: Types.ObjectId;
	content: string;
}

export interface IUpdateMessageDTO {
	id: Types.ObjectId;
	sender: string;
	content: string;
}

export interface ISeenMessage {
	id: Types.ObjectId;
	seenBy: string;
}

export interface IReactMessage {
	id: Types.ObjectId;
	reactBy: string;
}

export interface IDeleteMessageDTO {
	id: Types.ObjectId;
	sender: string;
}

export interface IResMessage {
	_id: Types.ObjectId;
	type: TypeMessage;
	conversation: Types.ObjectId;
	conversationDetails?: IResConversation;
	sender: string;
	senderDetail?: UserModel.User;
	content: string;
	seenBy: [string];
	seenByDetail: UserModel.User[];
	reactBy: [string];
	reactByDetail: UserModel.User[];
	updatedAt: Date;
	createdAt: Date;
	isDeleted: boolean;
}

export interface ISeenConMessages {
	id: string;
	seenBy: string;
}

