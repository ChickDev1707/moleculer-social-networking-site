import { HydratedDocument, Types } from "mongoose";
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
import messageModel from "../models/message.model";

export class MessageRepository {
	public async create(conversation: INewMessageDTO) {
		const newMessage: HydratedDocument<IMessageDTO> = new messageModel(
			conversation
		);
		await newMessage.save();
		return newMessage;
	}

  public async createAnonymousMessage(message: IAnonymousMessageDTO) {
		const newMessage: HydratedDocument<IMessageDTO> = new messageModel(
			message
		);
		await newMessage.save();
		return newMessage;
	}

	public async getById(id: Types.ObjectId) {
		const message = await messageModel.findById(id);
		return message;
	}

	public async getMessageOfConversation(
		conversationId: Types.ObjectId,
		page: number
	) {
		const messages = await messageModel
			.find({ conversation: conversationId})
			.sort({ createdAt: -1 })
			.skip((page - 1) * 5)
			.limit(5);
		return messages;
	}

	public async updateMessage(updateData: IUpdateMessageDTO) {
		try {
			const updatedMessage = await messageModel.findOneAndUpdate(
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
		const conversation = await messageModel.findOneAndUpdate(
			{ sender: deleteData.sender, _id: deleteData.id },
			{ isDeleted: true },
			{ new: true }
		);
		return conversation;
	}

	public async seenMessage(seenData: ISeenMessage) {
		const updatedMessage = await messageModel.findOneAndUpdate(
			{ _id: seenData.id, seenBy: { $ne: seenData.seenBy } },
			{ $push: { seenBy: seenData.seenBy } },
			{ new: true }
		);
		return updatedMessage;
	}

	public async reactMessage(reactData: IReactMessage) {
		const updatedMessage = await messageModel.findByIdAndUpdate(
			reactData.id,
			{ $push: { reactBy: reactData.reactBy } },
			{ new: true }
		);
		console.log(updatedMessage);
		return updatedMessage;
	}

	public async unReactMessage(reactData: IReactMessage) {
		const updatedMessage = await messageModel.findByIdAndUpdate(
			reactData.id,
			{ $pull: { reactBy: reactData.reactBy } },
			{ new: true }
		);
		return updatedMessage;
	}

	public async seenAllMessage(seenData: ISeenConMessages) {
		const updatedMessage = await messageModel.updateMany(
			{ conversation: seenData.id, seenBy: { $ne: seenData.seenBy } },
			{ $push: { seenBy: seenData.seenBy } }
		);
		return updatedMessage;
	}

	public async getLastMessage(data: any) {
		const message = await messageModel.find({ conversation: data.conversationId })
			.sort({ createdAt: -1 })
			.skip(0)
			.limit(1);

		return message;
	}
}
