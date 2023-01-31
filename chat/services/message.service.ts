import { Service, ServiceBroker } from "moleculer";
import mongoose, { Connection } from "mongoose";
import MessageActionRest from "./actions/messageRest.action";

export default class MessageService extends Service {
	private dbConnection: Connection = mongoose.createConnection(process.env.CHAT_DB_URI);
	private messageAction: MessageActionRest = new MessageActionRest(this.dbConnection);

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "messages",
			actions: {
				/**
				 * Create user message
				 */
				createRest: {
					rest: {
						method: "POST",
						path: "/",
					},
					handler: this.messageAction.createMessage,
				},
				seenRest: {
					rest: {
						method: "POST",
						path: "/seen",
					},
					handler: this.messageAction.seenMessage,
				},
				seenAllRest: {
					rest: {
						method: "PATCH",
						path: "/seenAll",
					},
					handler: this.messageAction.seenAllMessage,
				},
				reactMessage: {
					rest: {
						method: "PATCH",
						path: "/react",
					},
					handler: this.messageAction.reactMessage,
				},
				unReactMessage: {
					rest: {
						method: "PATCH",
						path: "/unReact",
					},
					handler: this.messageAction.unReactMessage,
				},
				deleteRest: {
					rest: {
						method: "PATCH",
						path: "/:id",
					},
					handler: this.messageAction.deleteMessage,
				},
				updateRest: {
					rest: {
						method: "PUT",
						path: "/:id",
					},
					handler: this.messageAction.updateMessage,
				},
				getConversationLastMessage: {
					rest: {
						method: "GET",
						path: "/lastMessage",
					},
					handler: this.messageAction.getLastMessage,
				},
				getConversationMessages: {
					rest: {
						method: "GET",
						path: "/",
					},
					handler: this.messageAction.getConversationMessages,
				},
			},
		});
	}
}
