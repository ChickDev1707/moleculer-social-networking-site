import { Service, ServiceBroker, Context } from "moleculer";
import * as dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";
import NotificationAction from "./actions/notification.action";
import { INotificationCrtDTO, INotificationDTO } from "./dtos/notification.dto";
dotenv.config();

export default class MessageService extends Service {
	private dbConnection: Connection = mongoose.createConnection(process.env.NOTIFICATION_DB);
	private conversationAct: NotificationAction = new NotificationAction(this.dbConnection);

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "notifications",
			events: {
        // Subscribe to "notification.create" event
        "notification.create"(notification: INotificationCrtDTO) {
					this.conversationAct.createNotificationVoid(broker, notification);
        },
			},
			actions: {
				/**
				 * Create notification for  a user
				 */
				createConversation: {
					rest: {
						method: "POST",
						path: "/",
					},
					handler: this.conversationAct.createNotification,
				},
				/**
				 * Get notification of a specific user by user id
				 * @param userId
				 * @param pageIndex
				 * @param pageSize
				 * @return notification[]
				 */
				getUserConversations: {
					rest: {
						method: "GET",
						path: "/",
					},
					params: {
						userId: "string",
					},
					handler: this.conversationAct.getUserNotification,
				},
				markAsRead: {
					rest: {
						method: "PATCH",
						path: "/:id/markAsRead",
					},
					handler: this.conversationAct.markAsReadNotification,
				},
				/**
				 * Get notification of a specific user by user id
				 * @param userId
				 * @param pageIndex
				 * @param pageSize
				 * @return notification[]
				 */
				markAsReadAll: {
					rest: {
						method: "PATCH",
						path: "/markAsReadAll",
					},
					handler: this.conversationAct.markAsReadAllNotification,
				},
				markAsUnread: {
					rest: {
						method: "PATCH",
						path: "/:id/markAsUnread",
					},
					handler: this.conversationAct.markAsUnReadNotification,
				},
				deleteNotification: {
					rest: {
						method: "DELETE",
						path: "/:id",
					},
					handler: this.conversationAct.DeleteNotification,
				},
			},
		});
	}
}
