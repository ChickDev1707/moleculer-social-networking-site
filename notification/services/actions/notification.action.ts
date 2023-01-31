/* eslint-disable no-underscore-dangle */
import { Context, Errors } from "moleculer";
import { Connection } from "mongoose";
import { IApiResponse } from "../types/api.type";
import { INotificationCrtDTO, INotificationDTO, IResNotification } from "../dtos/notification.dto";
import { NotificationRepository } from "../repository/notification.repository";

export default class NotificationAction {
	private notificationRepo: NotificationRepository;

	public constructor(connection: Connection) {
		this.notificationRepo = new NotificationRepository(connection);
	}

	public createNotificationVoid = async (broker: any, data: INotificationCrtDTO): Promise<IApiResponse> =>{
		try {
			const newNotificationDTO: INotificationDTO = {
				from: data.from,
				to: data.to,
				type: data.type,
				content: data.content,
				link: data.link,
				read: false,
				deleted: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const newNotification = await this.notificationRepo.create(newNotificationDTO);

			const from  = (await broker.call("users.getUser", {userId: newNotification.from}) as IApiResponse).data;
			const to  = (await broker.call("users.getUser", {userId: newNotification.to}) as IApiResponse).data;

			const resNotification: IResNotification = {
				_id: newNotification._id,
				from,
				to,
				type: newNotification.type,
				content: newNotification.content,
				link: newNotification.link,
				read: newNotification.read,
				deleted: newNotification.deleted,
				createdAt: newNotification.createdAt,
				updatedAt: newNotification.updatedAt,
			};

			broker.broadcast("notification.created", resNotification);
			return {
				code: 201,
				message: "Conversation was created",
				data: resNotification,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public createNotification = async (
		ctx: Context<INotificationCrtDTO>
	): Promise<IApiResponse> => {
		try {
			const newNotificationDTO: INotificationDTO = {
				from: ctx.params.from,
				to: ctx.params.to,
				type: ctx.params.type,
				content: ctx.params.content,
				link: ctx.params.link,
				read: false,
				deleted: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const newNotification = await this.notificationRepo.create(newNotificationDTO);

			const from  = (await ctx.broker.call("users.getUser", {userId: newNotification.from}) as IApiResponse).data;
			const to  = (await ctx.broker.call("users.getUser", {userId: newNotification.to}) as IApiResponse).data;

			const resNotification: IResNotification = {
				_id: newNotification._id,
				from,
				to,
				type: newNotification.type,
				content: newNotification.content,
				link: newNotification.link,
				read: newNotification.read,
				deleted: newNotification.deleted,
				createdAt: newNotification.createdAt,
				updatedAt: newNotification.updatedAt,
			};

			return {
				code: 201,
				message: "Conversation was created",
				data: resNotification,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public markAsReadAllNotification = async (
		ctx: Context<{ userId: string; pageIndex: number; pageSize: number }>
	): Promise<IApiResponse> => {
		try {
			const userId = ctx.params.userId;
			let pageIndex = 1;
			let pageSize = 10;
			if(ctx.params.pageIndex)
				{pageIndex = ctx.params.pageIndex;}
			if(ctx.params.pageIndex)
				{pageSize = ctx.params.pageSize;}
			const updatedConversation = await this.notificationRepo.markAsReadNotificationOfUser(userId);

			const notifications = await this.notificationRepo.getNotificationOfUser(userId, pageIndex, pageSize);
			const resNotifications: IResNotification[] = [];

			for (const notification of notifications) {
				const from  = (await ctx.broker.call("users.getUser", {userId: notification.from}) as IApiResponse).data;
				const to  = (await ctx.broker.call("users.getUser", {userId: notification.to}) as IApiResponse).data;

				const resNotification: IResNotification = {
					_id: notification._id,
					from,
					to,
					type: notification.type,
					content: notification.content,
					link: notification.link,
					read: notification.read,
					deleted: notification.deleted,
					createdAt: notification.createdAt,
					updatedAt: notification.updatedAt,
				};

				resNotifications.push(resNotification);
			}
			return { code: 201, message: "", data: resNotifications };
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public markAsReadNotification = async (
		ctx: Context<{ id: string}>
	): Promise<IApiResponse> => {
		try {
			const notification = await this.notificationRepo.getById(ctx.params.id);
			if(notification){
				return {
					code: 404,
					message: "notification was not found",
					data: null,
				};
			}

			notification.read = true;
			const updatedConversation = await this.notificationRepo.updateNotification(notification._id.toString(), notification);

			const from  = (await ctx.broker.call("users.getUser", {userId: updatedConversation.from}) as IApiResponse).data;
			const to  = (await ctx.broker.call("users.getUser", {userId: updatedConversation.to}) as IApiResponse).data;

			const resNotification: IResNotification = {
				_id: updatedConversation._id,
				from,
				to,
				type: updatedConversation.type,
				content: updatedConversation.content,
				link: updatedConversation.link,
				read: updatedConversation.read,
				deleted: updatedConversation.deleted,
				createdAt: updatedConversation.createdAt,
				updatedAt: updatedConversation.updatedAt,
			};

			return {
				code: 201,
				message: "Conversation was created",
				data: resNotification,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public markAsUnReadNotification = async (
		ctx: Context<{ id: string}>
	): Promise<IApiResponse> => {
		try {
			const notification = await this.notificationRepo.getById(ctx.params.id);
			if(notification){
				return {
					code: 404,
					message: "notification was not found",
					data: null,
				};
			}

			notification.read = false;
			const updatedConversation = await this.notificationRepo.updateNotification(notification._id.toString(), notification);

			const from  = (await ctx.broker.call("users.getUser", {userId: updatedConversation.from}) as IApiResponse).data;
			const to  = (await ctx.broker.call("users.getUser", {userId: updatedConversation.to}) as IApiResponse).data;

			const resNotification: IResNotification = {
				_id: updatedConversation._id,
				from,
				to,
				type: updatedConversation.type,
				content: updatedConversation.content,
				link: updatedConversation.link,
				read: updatedConversation.read,
				deleted: updatedConversation.deleted,
				createdAt: updatedConversation.createdAt,
				updatedAt: updatedConversation.updatedAt,
			};

			return {
				code: 201,
				message: "Conversation was created",
				data: resNotification,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public DeleteNotification = async (
		ctx: Context<{ id: string }>
	): Promise<IApiResponse> => {
		try {
			const updatedConversation = await this.notificationRepo.delete(ctx.params.id);
			return {
				code: 201,
				message: "Conversation was deleted",
				data: true,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public getUserNotification = async (ctx: Context<{ userId: string; pageIndex: number; pageSize: number }>): Promise<IApiResponse> => {
		try {
			const userId = ctx.params.userId;
			let pageIndex = 1;
			let pageSize = 10;
			if(ctx.params.pageIndex)
				{pageIndex = ctx.params.pageIndex;}
			if(ctx.params.pageIndex)
				{pageSize = ctx.params.pageSize;}

			const notifications = await this.notificationRepo.getNotificationOfUser(userId, pageIndex, pageSize);
			const resNotifications: IResNotification[] = [];

			for (const notification of notifications) {
				const from  = (await ctx.broker.call("users.getUser", {userId: notification.from}) as IApiResponse).data;
				const to  = (await ctx.broker.call("users.getUser", {userId: notification.to}) as IApiResponse).data;

				const resNotification: IResNotification = {
					_id: notification._id,
					from,
					to,
					type: notification.type,
					content: notification.content,
					link: notification.link,
					read: notification.read,
					deleted: notification.deleted,
					createdAt: notification.createdAt,
					updatedAt: notification.updatedAt,
				};

				resNotifications.push(resNotification);
			}
			return { code: 201, message: "", data: resNotifications };
		} catch (error) {
			console.log(error);
			return { code: 500, message: "Server error", data: null };
			// Throw new Errors.MoleculerError("Internal server error", 500);
		}
	};
}
