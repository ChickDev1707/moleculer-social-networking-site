import { Types } from "mongoose";
import { IResConversation, IUserInfo } from "./conversation.dto";

export interface IMessageDTO {
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    content: String;
    isDeleted: Boolean;
    seenBy: [Types.ObjectId];
    reactBy: [Types.ObjectId];
    updatedAt: Date;
    createdAt: Date
}

export interface INewMessageDTO {
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    content: String;
}

export interface IUpdateMessageDTO {
    id: Types.ObjectId;
    sender: Types.ObjectId;
    content: String;
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
    content: String;
    seenBy: [Types.ObjectId];
    seenByDetail: IUserInfo[];
    reactBy: [Types.ObjectId];
    reactByDetail: IUserInfo[];
    updatedAt: Date;
    createdAt: Date
}

// import * as Joi from "@hapi/joi";
// import "joi-extract-type";

// const RegisterDtoSchema: any = Joi.object().keys({
//   name: Joi.string().required(),
//   gender: Joi.string().required(),
//   dateOfBirth: Joi.date().required(),
//   password: Joi.string().required(),
// });