import { Service, ServiceBroker} from "moleculer";
import mongoose from "mongoose";
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
                        path: "/"
                    },
					handler: this.messageAction.createMessage
                },
                updateRest: {
                    rest: {
                        method: "PUT",
                        path: "/:id"
                    },
                    handler: this.messageAction.updateMessage
                },
                deleteRest: {
                    rest: {
                        method: "DELETE",
                        path: "/:id"
                    },
                    handler: this.messageAction.DeleteMessage
                },
                getConversationMessages: {
                    rest: {
                        method: "GET",
                        path: "/:conversationId/messages"
                    },
                    handler: this.messageAction.getConversationMessages
                },
                seenRest: {
                    rest: {
                        method: "POST",
                        path: "/message/seen"
                    },
                    handler: this.messageAction.seenMessage
                }
			},
            async started() {
				try {
					await mongoose.connect( process.env.MONGODB_URI);
					console.log("message service: connected to DB")
				} catch (error) {
					console.log("connect error")
				}	
			}
		});
	}
}
