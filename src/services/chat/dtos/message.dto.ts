import { Types } from "mongoose";
import { IResConversation, IUserInfo } from "./conversation.dto";

export interface IMessageDTO {
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
    conversation: Types.ObjectId;
    conversationDetails?: IResConversation;
    sender: string;
    senderDetail?: IUserInfo;
    content: string;
    seenBy: [string];
    seenByDetail: IUserInfo[];
    reactBy: [string];
    reactByDetail: IUserInfo[];
    updatedAt: Date;
    createdAt: Date;
    isDeleted: boolean;
}

export interface ISeenConMessages {
    id: string;
    seenBy: string;
}


// Import * as Joi from "@hapi/joi";
// Import "joi-extract-type";

// Const RegisterDtoSchema: any = Joi.object().keys({
//   Name: Joi.string().required(),
//   Gender: Joi.string().required(),
//   DateOfBirth: Joi.date().required(),
//   Password: Joi.string().required(),
// });
