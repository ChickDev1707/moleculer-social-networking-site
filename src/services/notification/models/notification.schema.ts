import mongoose from "mongoose";
import { INotificationDTO } from "../dtos/notification.dto";
const { Schema } = mongoose;

const NotificationSchema = new Schema<INotificationDTO>({
	from: {
		type: "string",
	},
	to: {
		type: "String",
	},
	type: {
		type: "string",
	},
	content: {
		type: "string",
	},
	link: {
		type: "string",
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	read: {
		type: "boolean",
	},
	deleted: {
		type: "boolean",
	},
});

export default NotificationSchema;
