import mongoose from "mongoose";
import { IMessageDTO } from "../dtos/message.dto";
const { Schema } = mongoose;

const MessagesSchema = new Schema<IMessageDTO>({
	type: {
		type: "number",
	},
	conversation: {
		type: Schema.Types.ObjectId,
		ref: "conversations",
	},
	sender: {
		type: "String",
	},
	content: {
		type: "String",
		required: true,
	},
	isDeleted: {
		type: "Boolean",
		default: false,
	},
	seenBy: [
		{
			type: "String",
		},
	],
	reactBy: [
		{
			type: "String",
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default MessagesSchema;
