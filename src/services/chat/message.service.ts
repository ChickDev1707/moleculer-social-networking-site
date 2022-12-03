import { Service, ServiceBroker} from "moleculer";
import mongoose from "mongoose";
import ApiService from "moleculer-web";
import MessageActionRest from "./actions/messageRest.action";

export default class MessageService extends Service {
	private messageAction: MessageActionRest;

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.messageAction = new MessageActionRest();
		this.parseServiceSchema({
			name: "messages",
			actions: {
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
                        method: "PUT",
                        path: "/seenAll",
                    },
                    handler: this.messageAction.seenAllMessage,
                },
                reactMessage: {
                    rest: {
                        method: "PUT",
                        path: "/react",
                    },
                    handler: this.messageAction.reactMessage,
                },
                unReactMessage: {
                    rest: {
                        method: "PUT",
                        path: "/unReact",
                    },
                    handler: this.messageAction.unReactMessage,
                },
                deleteRest: {
                    rest: {
                        method: "PUT",
                        path: "/:id/delete",
                    },
                    handler: this.messageAction.DeleteMessage,
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
                        path: "/:conversationId/last",
                    },
                    handler: this.messageAction.getLastMessage,
                },
                getConversationMessages: {
                    rest: {
                        method: "GET",
                        path: "/:conversationId",
                    },
                    handler: this.messageAction.getConversationMessages,
                },
			},
            // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
            async started() {
				try {
					await mongoose.connect( process.env.MONGODB_URI);
					console.log("message service: connected to DB");
				} catch (error) {
					console.log("connect error");
				}
			},
		});
	}
}
