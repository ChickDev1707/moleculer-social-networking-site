import mongoose, { Types } from "mongoose";
import { IMessageDTO } from "../dtos/message.dto";
const { Schema, model } = mongoose;

const messagesSchema = new Schema<IMessageDTO>({
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

export default model("messages", messagesSchema);
