import { Context, Errors } from "moleculer";
import mongoose, { isValidObjectId, Mongoose } from "mongoose";
import {
	IConversationDTO,
	IConversationOf2,
	IMemberDTO,
	IResConversation,
	IUserInfo,
} from "../dtos/conversation.dto";
const { Types } = mongoose;
import { ConversationRepository } from "../repository/conversation.repository";
import { IApiResponse } from "../../../../configs/api.type";
import { MessageRepository } from "../repository/message.repository";

export default class ConversationAction {
	private conversationRepo = new ConversationRepository();
	private messageRepo = new MessageRepository();
	public createConversation = async (
		ctx: Context<IConversationDTO>
	): Promise<IApiResponse> => {
		try {
			const newConversation = await this.conversationRepo.create(
				ctx.params
			);
			// Call user service to get user info
			const detailMembers = newConversation.members.map((mem, index) => ({
				_id: mem,
				name: "test" + index,
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			}));

			if (newConversation != null) {
				this.messageRepo.createAnonymousMessage({
					conversation: newConversation.id,
					content: "Đã tạo mới cuộc trò chuyện",
				});
			}

			const resConversation: IResConversation = {
				// eslint-disable-next-line no-underscore-dangle
				_id: newConversation._id,
				members: detailMembers,
				detailMembers,
				name: newConversation.name,
				avatar: newConversation.avatar,
				createdAt: newConversation.createdAt,
				updatedAt: newConversation.updatedAt,
				createdBy: newConversation.createdBy,
			};

			return {
				code: 201,
				message: "Conversation was created",
				data: resConversation,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public updateConversationName = async (
		ctx: Context<{ id: string; newName: string }>
	): Promise<IApiResponse> => {
		try {
			const updateConversation =
				await this.conversationRepo.updateConversationName(ctx.params);
			// Call user service to get user info
			// Call User service to get user info
			const detailMembers = updateConversation.members.map(
				(mem, index) => ({
					_id: mem,
					name: "test" + index,
					avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
				})
			);

			const resConversation: IResConversation = {
				// eslint-disable-next-line no-underscore-dangle
				_id: updateConversation._id,
				members: detailMembers,
				detailMembers,
				name: updateConversation.name,
				avatar: updateConversation.avatar,
				createdAt: updateConversation.createdAt,
				updatedAt: updateConversation.updatedAt,
				createdBy: updateConversation.createdBy,
			};

			return {
				code: 201,
				message: "Conversation was created",
				data: resConversation,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public updateConversationAvatar = async (
		ctx: Context<{ id: string; newAvatar: string }>
	): Promise<IApiResponse> => {
		try {
			const updateConversation =
				await this.conversationRepo.updateConversationAvatar(
					ctx.params
				);
			// Call user service to get user info
			// DetailMembers = await ctx.broker.call("");
			const detailMembers: IUserInfo[] = updateConversation.members.map(
				(mem, index) => ({
					_id: mem,
					name: "test" + index,
					avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
				})
			);

			const resConversation: IResConversation = {
				// eslint-disable-next-line no-underscore-dangle
				_id: updateConversation._id,
				members: detailMembers,
				detailMembers,
				name: updateConversation.name,
				avatar: updateConversation.avatar,
				createdAt: updateConversation.createdAt,
				updatedAt: updateConversation.updatedAt,
				createdBy: updateConversation.createdBy,
			};

			return {
				code: 201,
				message: "Conversation was created",
				data: resConversation,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public getConversation = async (ctx: any): Promise<IApiResponse> => {
		try {
			// Const userId = ctx.call("", ctx.params.requestToken);
			const conversation = await this.conversationRepo.getById(
				ctx.params.id
			);
			if (conversation == null) {
				return {
					code: 404,
					message: "Conversation not found",
					data: null,
				};
			}
			// Call User service to get user info
			let detailMembers: IUserInfo[];
			// DetailMembers = await ctx.broker.call("");
			const resConversation: IResConversation = {
				// eslint-disable-next-line no-underscore-dangle
				_id: conversation._id,
				members: detailMembers,
				detailMembers,
				name: conversation.name,
				avatar: conversation.avatar,
				createdAt: conversation.createdAt,
				updatedAt: conversation.updatedAt,
				createdBy: conversation.createdBy,
			};
			return { code: 201, message: "", data: resConversation };
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public getConversationOfTwoUser = async (
		ctx: Context<IConversationOf2>
	): Promise<IApiResponse> => {
		const conversation = await this.conversationRepo.getConversationOf2User(
			ctx.params
		);
		if (conversation == null) {
			return { code: 404, message: "Conversation not found", data: null };
		}

		// Call User service to get user info
		let detailMembers: IUserInfo[];
		// DetailMembers = await ctx.broker.call("");
		const resConversation: IResConversation = {
			// eslint-disable-next-line no-underscore-dangle
			_id: conversation._id,
			members: detailMembers,
			detailMembers,
			name: conversation.name,
			avatar: conversation.avatar,
			createdAt: conversation.createdAt,
			updatedAt: conversation.updatedAt,
			createdBy: conversation.createdBy,
		};
		return { code: 201, message: "", data: resConversation };
	};

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public getConversationOfMine = async (ctx: any): Promise<IApiResponse> => {
		try {
			// Const userId = ctx.call("", ctx.params.requestToken);
			const userId = ctx.params.userId;
			if (userId == null || !isValidObjectId(userId)){
				return { code: 404, message: "", data: null };
			}
			console.log(userId);
			const conversations =
				await this.conversationRepo.getConversationOfUser(userId);
			const resConversations: IResConversation[] = [];

			conversations.forEach((conversation: any) => {
				// Call user service to get user info
				// Let detailMembers: IUserInfo[];
				// DetailMembers = await ctx.broker.call("");
				// eslint-disable-next-line prefer-const
				const detailMembers = conversation.members.map(
					(mem: any, index: any) => ({
						_id: mem,
						name: "test" + index,
						avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
					})
				);
				const resConversation: IResConversation = {
					// eslint-disable-next-line no-underscore-dangle
					_id: conversation._id,
					members: detailMembers,
					detailMembers,
					name: conversation.name,
					avatar: conversation.avatar,
					createdAt: conversation.createdAt,
					updatedAt: conversation.updatedAt,
					createdBy: conversation.createdBy,
				};
				resConversations.push(resConversation);
			});
			return { code: 201, message: "", data: resConversations };
		} catch (error) {
			console.log(error);
			return { code: 500, message: "Server error", data: null };
			// Throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public addMember = async (
		ctx: Context<IMemberDTO>
	): Promise<IApiResponse> => {
		try {
			// Const existingUsers = await this.broker.call(
			// 	"",
			// 	[{  }]
			// );

			// If (!existingUsers) {
			// 	Return {
			// 		Succeeded: false,
			// 		Message: "",
			// 	};
			// }
			const conversation = await this.conversationRepo.getById(
				ctx.params.conversation
			);

			if (!conversation) {
				return {
					code: 404,
					message: "Conversation does not exist!",
					data: null,
				};
			}

			if (conversation.members.indexOf(ctx.params.member) !== -1) {
				return {
					code: 400,
					message: "Member already exist!",
					data: null,
				};
			}

			const updatedConversation = await this.conversationRepo.addMember(
				ctx.params
			);

			// // Call User service
			// Let detailMembers: IUserInfo[];
			// // DetailMembers = await ctx.broker.call("");

			const detailMembers = conversation.members.map((mem, index) => ({
				_id: new Types.ObjectId(),
				name: "test" + index,
				avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
			}));

			const resConversation: IResConversation = {
				// eslint-disable-next-line no-underscore-dangle
				_id: conversation._id,
				members: detailMembers,
				detailMembers,
				name: conversation.name,
				avatar: conversation.avatar,
				createdAt: conversation.createdAt,
				updatedAt: conversation.updatedAt,
				createdBy: conversation.createdBy,
			};

			return {
				code: 201,
				message: "Conversation updated",
				data: resConversation,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public removeMember = async (
		ctx: Context<IMemberDTO>
	): Promise<IApiResponse> => {
		try {
			// Const existingUsers = await this.broker.call(
			// 	"",
			// 	[{  }]
			// );

			// If (!existingUsers) {
			// 	Return {
			// 		Succeeded: false,
			// 		Message: "",
			// 	};
			// }

			const updatedConversation =
				await this.conversationRepo.removeMember(ctx.params);

			// Call user service to get UserInfo
			const detailMembers = updatedConversation.members.map(
				(mem, index) => ({
					_id: new Types.ObjectId(),
					name: "test" + index,
					avatar: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
				})
			);

			const resConversation: IResConversation = {
				// eslint-disable-next-line no-underscore-dangle
				_id: updatedConversation._id,
				members: detailMembers,
				detailMembers,
				name: updatedConversation.name,
				avatar: updatedConversation.avatar,
				createdAt: updatedConversation.createdAt,
				updatedAt: updatedConversation.updatedAt,
				createdBy: updatedConversation.createdBy,
			};
			return { code: 201, message: "", data: resConversation };
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};
}
