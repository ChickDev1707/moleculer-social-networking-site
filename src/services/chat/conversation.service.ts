import { Service, ServiceBroker, Context } from "moleculer";
import * as dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";
import ConversationAction from "./actions/conversation.action";
dotenv.config();

export default class MessageService extends Service {
	private dbConnection: Connection = mongoose.createConnection(process.env.CHAT_DB_URI);
	private conversationAct: ConversationAction = new ConversationAction(this.dbConnection);

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "conversations",
			actions: {
				/**
				 * Create conversation for  a user
				 */
				createConversation: {
					rest: {
						method: "POST",
						path: "/",
					},
					handler: this.conversationAct.createConversation,
				},
				/**
				 * Get conversations of a specific user by user id
				 * @param userId
				 * @return conversations[]
				 */
				getUserConversations: {
					rest: {
						method: "GET",
						path: "/",
					},
					params: {
						userId: "string",
					},
					handler: this.conversationAct.getUserConversations,
				},
				getConversationById: {
					rest: {
						method: "GET",
						path: "/:id",
					},
					handler: this.conversationAct.getConversation,
				},
				updateConversationName: {
					rest: {
						method: "PATCH",
						path: "/:id/name",
					},
					handler: this.conversationAct.updateConversationName,
				},
				updateConversationAvatar: {
					rest: {
						method: "PATCH",
						path: "/:id/avatar",
					},
					handler: this.conversationAct.updateConversationAvatar,
				},
				addMemberToConversation: {
					rest: {
						method: "PATCH",
						path: "/:conversation/addMember",
					},
					handler: this.conversationAct.addMember,
				},
				removeMemberToConversation: {
					rest: {
						method: "PATCH",
						path: "/:conversation/removeMember",
					},
					handler: this.conversationAct.removeMember,
				},
			},
		});
	}
}
