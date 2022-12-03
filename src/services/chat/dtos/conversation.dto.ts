import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;

export interface IConversationDTO {
    name?: string;
    members: Types.Array<Types.ObjectId>;
    avatar?: string;
    updatedAt?: Date;
    createdAt?: Date;
    createdBy: Types.ObjectId;
}

export interface IConversationOf2 {
    userId1: Types.ObjectId;
    userId2?: Types.ObjectId;
}


export interface IMemberDTO {
    conversation: Types.ObjectId;
    member: Types.ObjectId;
}

export interface IResConversation {
    _id: Types.ObjectId;
    name: string;
    members: IUserInfo[];
    detailMembers: IUserInfo[];
    avatar?: string;
    updatedAt: Date;
    createdAt: Date;
    createdBy: Types.ObjectId;
}

export interface IUserInfo {
    _id: Types.ObjectId;
    name: string;
    avatar?: string;
}
