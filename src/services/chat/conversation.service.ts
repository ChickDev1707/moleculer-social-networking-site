import { Service, ServiceBroker, Context } from "moleculer";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import ConversationAction from "./actions/conversation.action";
dotenv.config();

export default class MessageService extends Service {
	private conversationAct: ConversationAction;

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.conversationAct = new ConversationAction();

		this.parseServiceSchema({
			name: "conversations",
			actions: {
				createConversation: {
					rest: {
						method: "POST",
						path: "/",
					},
					handler: this.conversationAct.createConversation,
				},
				getConversationById: {
					rest: {
						method: "GET",
						path: "/:id",
					},
					handler: this.conversationAct.getConversation,
				},
				getConversationOfMine: {
					rest: {
						method: "GET",
						path: "/",
					},
					handler: this.conversationAct.getConversationOfMine,
				},
				updateConversationName: {
					rest: {
						method: "PATCH",
						path: "/:id/Name",
					},
					handler: this.conversationAct.updateConversationName,
				},
				updateConversationAvatar: {
					rest: {
						method: "PATCH",
						path: "/:id/Avatar",
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
			started: async () => {
				try {
					await mongoose.connect(process.env.CHAT_DB_URI);
					console.log("conversation service: connected to DB");
				} catch (error) {
					console.log("connect error");
				}
			},
		});
	}
}
