import mongoose from "mongoose";
import { IConversationDTO } from "../dtos/conversation.dto";
const { Schema } = mongoose;

const ConversationSchema = new Schema<IConversationDTO>({
	name: {
		type: "String",
		default: "",
	},
	members: [
		{
			type: "String",
		},
	],
	avatar: {
		type: "String",
		default: "",
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: "String",
	},
});

export default ConversationSchema;
