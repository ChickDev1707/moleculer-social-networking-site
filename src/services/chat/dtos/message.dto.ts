import { Types } from "mongoose";
import { IResConversation, IUserInfo } from "./conversation.dto";

export interface IMessageDTO {
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
    isDeleted: boolean;
    seenBy: [Types.ObjectId];
    reactBy: [Types.ObjectId];
    updatedAt: Date;
    createdAt: Date;
}

export interface INewMessageDTO {
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
}

export interface IAnonymousMessageDTO {
    conversation: Types.ObjectId;
    content: string;
}

export interface IUpdateMessageDTO {
    id: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
}

export interface ISeenMessage {
    id: Types.ObjectId;
    seenBy: Types.ObjectId;
}

export interface IReactMessage {
    id: Types.ObjectId;
    reactBy: Types.ObjectId;
}

export interface IDeleteMessageDTO {
    id: Types.ObjectId;
    sender: Types.ObjectId;
}

export interface IResMessage {
    _id: Types.ObjectId;
    conversation: Types.ObjectId;
    conversationDetails?: IResConversation;
    sender: Types.ObjectId;
    senderDetail?: IUserInfo;
    content: string;
    seenBy: [Types.ObjectId];
    seenByDetail: IUserInfo[];
    reactBy: [Types.ObjectId];
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
