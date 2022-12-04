import { Context, Errors } from "moleculer";
import { Types } from "mongoose";
import { IResConversation, IUserInfo } from "../dtos/conversation.dto";
import { MessageRepository } from "../repository/message.repository";
import {
	IDeleteMessageDTO,
	INewMessageDTO,
	IReactMessage,
	IResMessage,
	ISeenConMessages,
	ISeenMessage,
	IUpdateMessageDTO,
} from "../dtos/message.dto";
import { ConversationRepository } from "../repository/conversation.repository";
import { IApiResponse } from "../../../../configs/api.type";

export default class MessageActionRest {
	private messageRepo = new MessageRepository();
	private conversationRepo = new ConversationRepository();

	public createMessage = async (
		ctx: Context<INewMessageDTO>
	): Promise<IApiResponse> => {
		try {
			const newMessage = await this.messageRepo.create(ctx.params);

			// SenderInfo = await ctx.broker.call("");
			const senderDetail = (
				(await ctx.broker.call("users.getUser", {
					userId: newMessage.sender,
				})) as IApiResponse
			).data as IUserInfo;

			let conversationDetails: IResConversation;
			// ConversationDetails = await ctx.broker.call("")

			const resMessage: IResMessage = {
				// eslint-disable-next-line no-underscore-dangle
				_id: newMessage._id,
				conversation: newMessage.conversation,
				conversationDetails,
				sender: newMessage.sender,
				senderDetail,
				content: newMessage.content,
				seenBy: newMessage.seenBy,
				reactBy: newMessage.reactBy,
				seenByDetail: [],
				reactByDetail: [],
				updatedAt: newMessage.updatedAt,
				createdAt: newMessage.createdAt,
				isDeleted: newMessage.isDeleted,
			};

			return {
				code: 201,
				message: "message was created",
				data: resMessage,
			};
		} catch (error) {
			console.log(error);
			return { code: 500, message: "Server error", data: null };
			// Throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public DeleteMessage = async (
		ctx: Context<IDeleteMessageDTO>
	): Promise<IApiResponse> => {
		try {
			const updatedMessage = await this.messageRepo.deleteMessage(
				ctx.params
			);
			const senderDetail = (
				(await ctx.broker.call("users.getUser", {
					userId: updatedMessage.sender,
				})) as IApiResponse
			).data as IUserInfo;

			const seenByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.seenBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const reactByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.reactBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const resMessage: IResMessage = {
				// eslint-disable-next-line no-underscore-dangle
				_id: updatedMessage._id,
				conversation: updatedMessage.conversation,
				sender: updatedMessage.sender,
				senderDetail,
				content: updatedMessage.content,
				seenBy: updatedMessage.seenBy,
				reactBy: updatedMessage.reactBy,
				seenByDetail,
				reactByDetail,
				updatedAt: updatedMessage.updatedAt,
				createdAt: updatedMessage.createdAt,
				isDeleted: updatedMessage.isDeleted,
			};

			return {
				code: 201,
				message: "Message was deleted",
				data: resMessage,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public updateMessage = async (
		ctx: Context<IUpdateMessageDTO>
	): Promise<IApiResponse> => {
		try {
			const updatedMessage = await this.messageRepo.updateMessage(
				ctx.params
			);

			let senderDetail: IUserInfo;
			// SenderInfo = await ctx.broker.call("");

			let conversationDetails: IResConversation;
			// ConversationDetails = await ctx.broker.call("")

			const resMessage: IResMessage = {
				// eslint-disable-next-line no-underscore-dangle
				_id: updatedMessage._id,
				conversation: updatedMessage.conversation,
				conversationDetails,
				sender: updatedMessage.sender,
				senderDetail,
				content: updatedMessage.content,
				seenBy: updatedMessage.seenBy,
				reactBy: updatedMessage.reactBy,
				seenByDetail: [],
				reactByDetail: [],
				updatedAt: updatedMessage.updatedAt,
				createdAt: updatedMessage.createdAt,
				isDeleted: updatedMessage.isDeleted,
			};

			return {
				code: 201,
				message: "Message was updated",
				data: resMessage,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public seenMessage = async (
		ctx: Context<ISeenMessage>
	): Promise<IApiResponse> => {
		try {
			const updatedMessage = await this.messageRepo.seenMessage(
				ctx.params
			);
			let senderDetail: IUserInfo;
			if (updatedMessage.sender) {
				senderDetail = (
					(await ctx.broker.call("users.getUser", {
						userId: updatedMessage.sender,
					})) as IApiResponse
				).data as IUserInfo;
			}

			const seenByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.seenBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const reactByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.reactBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const resMessage: IResMessage = {
				// eslint-disable-next-line no-underscore-dangle
				_id: updatedMessage._id,
				conversation: updatedMessage.conversation,
				sender: updatedMessage.sender,
				senderDetail,
				content: updatedMessage.content,
				seenBy: updatedMessage.seenBy,
				reactBy: updatedMessage.reactBy,
				seenByDetail,
				reactByDetail,
				updatedAt: updatedMessage.updatedAt,
				createdAt: updatedMessage.createdAt,
				isDeleted: updatedMessage.isDeleted,
			};

			return { code: 201, message: "seen", data: resMessage };
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public reactMessage = async (
		ctx: Context<IReactMessage>
	): Promise<IApiResponse> => {
		try {
			console.log(ctx.params);
			const updatedMessage = await this.messageRepo.reactMessage(
				ctx.params
			);
			const senderDetail = (
				(await ctx.broker.call("users.getUser", {
					userId: updatedMessage.sender,
				})) as IApiResponse
			).data as IUserInfo;

			const seenByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.seenBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const reactByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.reactBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			let conversationDetails: IResConversation;

			const resMessage: IResMessage = {
				// eslint-disable-next-line no-underscore-dangle
				_id: updatedMessage._id,
				conversation: updatedMessage.conversation,
				conversationDetails,
				sender: updatedMessage.sender,
				senderDetail,
				content: updatedMessage.content,
				seenBy: updatedMessage.seenBy,
				reactBy: updatedMessage.reactBy,
				seenByDetail,
				reactByDetail,
				updatedAt: updatedMessage.updatedAt,
				createdAt: updatedMessage.createdAt,
				isDeleted: updatedMessage.isDeleted,
			};
			return { code: 201, message: "Reacted", data: resMessage };
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public unReactMessage = async (
		ctx: Context<IReactMessage>
	): Promise<IApiResponse> => {
		try {
			const updatedMessage = await this.messageRepo.unReactMessage(
				ctx.params
			);
			const senderDetail = (
				(await ctx.broker.call("users.getUser", {
					userId: updatedMessage.sender,
				})) as IApiResponse
			).data as IUserInfo;

			const seenByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.seenBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const reactByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.reactBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const resMessage: IResMessage = {
				// eslint-disable-next-line no-underscore-dangle
				_id: updatedMessage._id,
				conversation: updatedMessage.conversation,
				sender: updatedMessage.sender,
				senderDetail,
				content: updatedMessage.content,
				seenBy: updatedMessage.seenBy,
				reactBy: updatedMessage.reactBy,
				seenByDetail,
				reactByDetail,
				updatedAt: updatedMessage.updatedAt,
				createdAt: updatedMessage.createdAt,
				isDeleted: updatedMessage.isDeleted,
			};
			return { code: 201, message: "Reacted", data: resMessage };
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public getConversationMessages = async (
		ctx: any
	): Promise<IApiResponse> => {
		try {
			const messages = await this.messageRepo.getMessageOfConversation(
				ctx.params.conversationId,
				ctx.params.page
			);

			const resMessages = await Promise.all(
				messages.map(async (message: any) => {
					let senderDetail: IUserInfo;
					if (message.sender) {
						senderDetail = (
							(await ctx.broker.call("users.getUser", {
								userId: message.sender,
							})) as IApiResponse
						).data as IUserInfo;
					}

					const seenByDetail: IUserInfo[] = await Promise.all(
						message.seenBy.map(
							async (mem: string, index: any) =>
								(
									(await ctx.broker.call("users.getUser", {
										userId: mem,
									})) as IApiResponse
								).data as IUserInfo
						)
					);

					const reactByDetail: IUserInfo[] = await Promise.all(
						message.reactBy.map(
							async (mem: string, index: any) =>
								(
									(await ctx.broker.call("users.getUser", {
										userId: mem,
									})) as IApiResponse
								).data as IUserInfo
						)
					);

					const resMessage: IResMessage = {
						// eslint-disable-next-line no-underscore-dangle
						_id: message._id,
						conversation: message.conversation,
						sender: message.sender,
						senderDetail,
						content: message.content,
						seenBy: message.seenBy,
						reactBy: message.reactBy,
						seenByDetail,
						reactByDetail,
						updatedAt: message.updatedAt,
						createdAt: message.createdAt,
						isDeleted: message.isDeleted,
					};
					return resMessage;
				})
			);

			return { code: 201, message: "", data: resMessages };
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public deleteMessage = async (
		ctx: Context<IDeleteMessageDTO>
	): Promise<IApiResponse> => {
		try {
			const updatedMessage = await this.messageRepo.deleteMessage(
				ctx.params
			);
			const senderDetail = (
				(await ctx.broker.call("users.getUser", {
					userId: updatedMessage.sender,
				})) as IApiResponse
			).data as IUserInfo;

			const seenByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.seenBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const reactByDetail: IUserInfo[] = await Promise.all(
				updatedMessage.reactBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const resMessage: IResMessage = {
				// eslint-disable-next-line no-underscore-dangle
				_id: updatedMessage._id,
				conversation: updatedMessage.conversation,
				sender: updatedMessage.sender,
				senderDetail,
				content: updatedMessage.content,
				seenBy: updatedMessage.seenBy,
				reactBy: updatedMessage.reactBy,
				seenByDetail,
				reactByDetail,
				updatedAt: updatedMessage.updatedAt,
				createdAt: updatedMessage.createdAt,
				isDeleted: updatedMessage.isDeleted,
			};
			return {
				code: 201,
				message: "Message was deleted",
				data: resMessage,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public seenAllMessage = async (
		ctx: Context<ISeenConMessages>
	): Promise<IApiResponse> => {
		try {
			const messages = await this.messageRepo.seenAllMessage(ctx.params);
			const seenUserInfo = (
				(await ctx.broker.call("users.getUser", {
					userId: ctx.params.seenBy,
				})) as IApiResponse
			).data as IUserInfo;

			return {
				code: 201,
				message: "Message was deleted",
				data: seenUserInfo,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public getLastMessage = async (
		ctx: Context<string>
	): Promise<IApiResponse> => {
		try {
			const messages = await this.messageRepo.getLastMessage(ctx.params);
			if (messages.length === 0) {
				return {
					code: 201,
					message: "Success",
					data: null,
				};
			}
			let senderDetail: IUserInfo;
			if (messages[0].sender) {
				senderDetail = (
					(await ctx.broker.call("users.getUser", {
						userId: messages[0].sender,
					})) as IApiResponse
				).data as IUserInfo;
			}

			const seenByDetail: IUserInfo[] = await Promise.all(
				messages[0].seenBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const reactByDetail: IUserInfo[] = await Promise.all(
				messages[0].reactBy.map(
					async (mem: string, index: any) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const resMessage: IResMessage = {
				// eslint-disable-next-line no-underscore-dangle
				_id: messages[0]._id,
				conversation: messages[0].conversation,
				sender: messages[0].sender,
				senderDetail,
				content: messages[0].content,
				seenBy: messages[0].seenBy,
				reactBy: messages[0].reactBy,
				seenByDetail,
				reactByDetail,
				updatedAt: messages[0].updatedAt,
				createdAt: messages[0].createdAt,
				isDeleted: messages[0].isDeleted,
			};
			return {
				code: 201,
				message: "Success",
				data: resMessage,
			};
		} catch (error) {
			console.log(error);
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};
}
