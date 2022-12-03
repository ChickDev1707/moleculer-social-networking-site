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
			const senderDetail = {
				_id: new Types.ObjectId(),
				name: "test",
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			};

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
			const senderDetail = {
				_id: new Types.ObjectId(),
				name: "test",
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			};

			let conversationDetails: IResConversation;
			// ConversationDetails = await ctx.broker.call("")

			const seenByDetail: IUserInfo[] = updatedMessage.seenBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					// SenderInfo = await ctx.broker.call("");
					return userInfo;
				}
			);

			const reactByDetail: IUserInfo[] = updatedMessage.reactBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// SenderInfo = await ctx.broker.call("");
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					return userInfo;
				}
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

			return { code: 201, message: "Message was deleted", data: resMessage };
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
      const senderDetail = {
				_id: new Types.ObjectId(),
				name: "test",
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			};

			let conversationDetails: IResConversation;
			// ConversationDetails = await ctx.broker.call("")

			const seenByDetail: IUserInfo[] = updatedMessage.seenBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					// SenderInfo = await ctx.broker.call("");
					return userInfo;
				}
			);

			const reactByDetail: IUserInfo[] = updatedMessage.reactBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// SenderInfo = await ctx.broker.call("");
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					return userInfo;
				}
			);
			return { code: 201, message: "seen", data: updatedMessage };
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public reactMessage = async (
		ctx: Context<IReactMessage>
	): Promise<IApiResponse> => {
		try {
			const updatedMessage = await this.messageRepo.reactMessage(
				ctx.params
			);
			const senderDetail = {
				_id: new Types.ObjectId(),
				name: "test",
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			};

			let conversationDetails: IResConversation;
			// ConversationDetails = await ctx.broker.call("")

			const seenByDetail: IUserInfo[] = updatedMessage.seenBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					// SenderInfo = await ctx.broker.call("");
					return userInfo;
				}
			);

			const reactByDetail: IUserInfo[] = updatedMessage.reactBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// SenderInfo = await ctx.broker.call("");
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					return userInfo;
				}
			);

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
      const senderDetail = {
				_id: new Types.ObjectId(),
				name: "test",
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			};

			let conversationDetails: IResConversation;
			// ConversationDetails = await ctx.broker.call("")

			const seenByDetail: IUserInfo[] = updatedMessage.seenBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					// SenderInfo = await ctx.broker.call("");
					return userInfo;
				}
			);

			const reactByDetail: IUserInfo[] = updatedMessage.reactBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// SenderInfo = await ctx.broker.call("");
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					return userInfo;
				}
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

			const resMessages = messages.map((message: any) => {
				let senderDetail: IUserInfo;
				// eslint-disable-next-line prefer-const
				senderDetail = {
					_id: new Types.ObjectId(),
					name: "test",
					avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
				};
				// SenderInfo = await ctx.broker.call("");

				const seenByDetail: IUserInfo[] = message.seenBy.map((use: any) => {
					let userInfo: IUserInfo;
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					// SenderInfo = await ctx.broker.call("");
					return userInfo;
				});

				const reactByDetail: IUserInfo[] = message.reactBy.map(
					(user: any) => {
						let userInfo: IUserInfo;
						// SenderInfo = await ctx.broker.call("");
						// eslint-disable-next-line prefer-const
						userInfo = {
							_id: new Types.ObjectId(),
							name: "test",
							avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
						};
						return userInfo;
					}
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
			});

			return { code: 201, message: "", data: resMessages };
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public deleteMessage = async (
		ctx: Context<IDeleteMessageDTO>
	): Promise<IApiResponse> => {
		try {
			const updatedMessage = await this.messageRepo.deleteMessage(ctx.params);
			const senderDetail = {
				_id: new Types.ObjectId(),
				name: "test",
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			};

			let conversationDetails: IResConversation;
			// ConversationDetails = await ctx.broker.call("")

			const seenByDetail: IUserInfo[] = updatedMessage.seenBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					// SenderInfo = await ctx.broker.call("");
					return userInfo;
				}
			);

			const reactByDetail: IUserInfo[] = updatedMessage.reactBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// SenderInfo = await ctx.broker.call("");
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					return userInfo;
				}
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
			// SenderInfo = await ctx.broker.call("");
			const userInfo: IUserInfo = {
				_id: new Types.ObjectId(),
				name: "test",
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			};
			return {
				code: 201,
				message: "Message was deleted",
				data: userInfo,
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
			const senderDetail = {
				_id: new Types.ObjectId(),
				name: "test",
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			};

			if(messages == null || messages.length === 0)
			{
				return {
					code: 201,
					message: "success",
					data: null,
				};
			}

			const seenByDetail: IUserInfo[] = messages[0].seenBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					// SenderInfo = await ctx.broker.call("");
					return userInfo;
				}
			);

			const reactByDetail: IUserInfo[] = messages[0].reactBy.map(
				(user: any) => {
					let userInfo: IUserInfo;
					// SenderInfo = await ctx.broker.call("");
					// eslint-disable-next-line prefer-const
					userInfo = {
						_id: new Types.ObjectId(),
						name: "test",
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					};
					return userInfo;
				}
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
