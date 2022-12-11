/* eslint-disable no-underscore-dangle */
import { Context, Errors } from "moleculer";
import mongoose from "mongoose";
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

			const detailMembers: IUserInfo[] = await Promise.all(
				newConversation.members.map(
					async (mem: string) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			if (newConversation != null) {
				this.messageRepo.createAnonymousMessage({
					conversation: newConversation.id,
					content: "Đã tạo mới cuộc trò chuyện",
				});
			}

			const resConversation: IResConversation = {
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
			const updatedConversation =
				await this.conversationRepo.updateConversationName(ctx.params);

			const detailMembers: IUserInfo[] = await Promise.all(
				updatedConversation.members.map(
					async (mem: string) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const resConversation: IResConversation = {
				_id: updatedConversation._id,
				members: detailMembers,
				detailMembers,
				name: updatedConversation.name,
				avatar: updatedConversation.avatar,
				createdAt: updatedConversation.createdAt,
				updatedAt: updatedConversation.updatedAt,
				createdBy: updatedConversation.createdBy,
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
			const updatedConversation =
				await this.conversationRepo.updateConversationAvatar(
					ctx.params
				);

			const detailMembers: IUserInfo[] = await Promise.all(
				updatedConversation.members.map(
					async (mem: string) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const resConversation: IResConversation = {
				_id: updatedConversation._id,
				members: detailMembers,
				detailMembers,
				name: updatedConversation.name,
				avatar: updatedConversation.avatar,
				createdAt: updatedConversation.createdAt,
				updatedAt: updatedConversation.updatedAt,
				createdBy: updatedConversation.createdBy,
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

	public getConversation = async (ctx: Context<{ id: mongoose.Types.ObjectId }>): Promise<IApiResponse> => {
		try {
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

			const detailMembers: IUserInfo[] = await Promise.all(
				conversation.members.map(
					async (mem: string) =>
						(
							await ctx.broker.call("users.getUser", {
								userId: mem,
							}) as IApiResponse
						).data as IUserInfo
				)
			);

			const resConversation: IResConversation = {
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
		const resConversation: IResConversation = {
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

	public getConversationOfMine = async (ctx: Context<{userId: string}>): Promise<IApiResponse> => {
		try {
			// Const userId = ctx.call("", ctx.params.requestToken);
			const userId = ctx.params.userId;
			const conversations =
				await this.conversationRepo.getConversationOfUser(userId);
			const resConversations: IResConversation[] = [];

			for (const conversation of conversations) {
				const detailMembers = await Promise.all(
					conversation.members.map(
						async (mem: string) =>
							(
								await ctx.broker.call("users.getUser", {
									userId: mem,
								}) as IApiResponse
							).data as IUserInfo
					)
				);
				const resConversation: IResConversation = {
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
			}
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

			const detailMembers = await Promise.all(
				conversation.members.map(
					async (mem: string) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const resConversation: IResConversation = {
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

	public removeMember = async (
		ctx: Context<IMemberDTO>
	): Promise<IApiResponse> => {
		try {
			const updatedConversation =
				await this.conversationRepo.removeMember(ctx.params);

			// Call user service to get UserInfo
			const detailMembers = await Promise.all(
				updatedConversation.members.map(
					async (mem: string) =>
						(
							(await ctx.broker.call("users.getUser", {
								userId: mem,
							})) as IApiResponse
						).data as IUserInfo
				)
			);

			const resConversation: IResConversation = {
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
