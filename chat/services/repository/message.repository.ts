import { Connection, HydratedDocument, Model, Types } from "mongoose";
import {
  IAnonymousMessageDTO,
	IDeleteMessageDTO,
	IMessageDTO,
	INewMessageDTO,
	IReactMessage,
	ISeenConMessages,
	ISeenMessage,
	IUpdateMessageDTO,
} from "../dtos/message.dto";
import MessagesSchema from "../models/message.schema";
import messageModel from "../models/message.schema";

export class MessageRepository {
	private MessageModel: Model<IMessageDTO>;
  public constructor(connection: Connection){
    this.MessageModel = connection.model("messages", MessagesSchema);
  }
	public async create(conversation: INewMessageDTO) {
		const newMessage: HydratedDocument<IMessageDTO> = new this.MessageModel(
			conversation
		);
		await newMessage.save();
		return newMessage;
	}

  public async createAnonymousMessage(message: IAnonymousMessageDTO) {
		const newMessage: HydratedDocument<IMessageDTO> = new this.MessageModel(
			message
		);
		await newMessage.save();
		return newMessage;
	}

	public async getById(id: Types.ObjectId) {
		const message = await this.MessageModel.findById(id);
		return message;
	}

	public async getMessageOfConversation(
		conversationId: Types.ObjectId,
		page: number
	) {
		const messages = await this.MessageModel
			.find({ conversation: conversationId})
			.sort({ createdAt: -1 })
			.skip((page - 1) * 5)
			.limit(5);
		return messages;
	}

	public async updateMessage(updateData: IUpdateMessageDTO) {
		try {
			const updatedMessage = await this.MessageModel.findOneAndUpdate(
				{ _id: updateData.id, sender: updateData.sender },
				{ content: updateData.content },
				{ new: true }
			);
			return updatedMessage;
		} catch (error) {
			console.log(error);
		}
	}

	public async deleteMessage(deleteData: IDeleteMessageDTO) {
		const conversation = await this.MessageModel.findOneAndUpdate(
			{ sender: deleteData.sender, _id: deleteData.id },
			{ isDeleted: true },
			{ new: true }
		);
		return conversation;
	}

	public async seenMessage(seenData: ISeenMessage) {
		const updatedMessage = await this.MessageModel.findOneAndUpdate(
			{ _id: seenData.id, seenBy: { $ne: seenData.seenBy } },
			{ $push: { seenBy: seenData.seenBy } },
			{ new: true }
		);
		return updatedMessage;
	}

	public async reactMessage(reactData: IReactMessage) {
		const updatedMessage = await this.MessageModel.findByIdAndUpdate(
			reactData.id,
			{ $push: { reactBy: reactData.reactBy } },
			{ new: true }
		);
		return updatedMessage;
	}

	public async unReactMessage(reactData: IReactMessage) {
		const updatedMessage = await this.MessageModel.findByIdAndUpdate(
			reactData.id,
			{ $pull: { reactBy: reactData.reactBy } },
			{ new: true }
		);
		return updatedMessage;
	}

	public async seenAllMessage(seenData: ISeenConMessages) {
		const updatedMessage = await this.MessageModel.updateMany(
			{ conversation: seenData.id, seenBy: { $ne: seenData.seenBy } },
			{ $push: { seenBy: seenData.seenBy } }
		);
		return updatedMessage;
	}

	public async getLastMessage(conversationId: string) {
		const message = await this.MessageModel.find({ conversation: conversationId })
			.sort({ createdAt: -1 })
			.skip(0)
			.limit(1);

		return message;
	}
}
