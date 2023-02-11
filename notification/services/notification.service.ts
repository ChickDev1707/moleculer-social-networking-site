import { Service, ServiceBroker } from "moleculer";
import * as dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";
import NotificationAction from "./actions/notification.action";
import { INotificationCrtDTO, INotificationDTO } from "./dtos/notification.dto";
dotenv.config();

export default class MessageService extends Service {
	private dbConnection: Connection = mongoose.createConnection(process.env.NOTIFICATION_DB_URI);
	private notificationAct: NotificationAction = new NotificationAction(this.dbConnection);

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "notifications",
			events: {
        // Subscribe to "notification.create" event
        "notification.create"(notification: INotificationCrtDTO) {
					this.notificationAct.createNotificationVoid(broker, notification);
        },
			},
			actions: {
				/**
				 * Create notification for  a user
				 */
				createNotification: {
					rest: {
						method: "POST",
						path: "/",
					},
					handler: this.notificationAct.createNotification,
				},
				/**
				 * Get notification of a specific user by user id
				 * @param userId
				 * @param pageIndex
				 * @param pageSize
				 * @return notification[]
				 */
				getUserNotifications: {
					rest: {
						method: "GET",
						path: "/",
					},
					params: {
						userId: "string",
					},
					handler: this.notificationAct.getUserNotification,
				},
				markAsRead: {
					rest: {
						method: "PATCH",
						path: "/:id/markAsRead",
					},
					handler: this.notificationAct.markAsReadNotification,
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
					handler: this.notificationAct.markAsReadAllNotification,
				},
				markAsUnread: {
					rest: {
						method: "PATCH",
						path: "/:id/markAsUnread",
					},
					handler: this.notificationAct.markAsUnReadNotification,
				},
				deleteNotification: {
					rest: {
						method: "DELETE",
						path: "/:id",
					},
					handler: this.notificationAct.DeleteNotification,
				},
			},
		});
	}
}
