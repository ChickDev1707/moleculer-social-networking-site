import { Types } from "mongoose";
import { UserModel } from "../types/user-models";
import { TypeNotification } from "../enums/type-notification.enum";

export interface INotificationDTO {
	from: string;
	to: string;
	content?: string;
	link?: string;
	type: TypeNotification;
	updatedAt?: Date;
	createdAt?: Date;
	read: boolean;
	deleted: boolean;
}

export interface IResNotification {
	_id: Types.ObjectId;
	from: UserModel.User;
	to: UserModel.User;
	content?: string;
	link?: string;
	type: TypeNotification;
	updatedAt: Date;
	createdAt: Date;
	read: boolean;
	deleted: boolean;
}

export interface INotificationCrtDTO {
	from: string;
	to: string;
	content?: string;
	link?: string;
	type: TypeNotification;
}
