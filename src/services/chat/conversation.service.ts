import {Service, ServiceBroker, Context} from "moleculer";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import ConversationAction  from "./actions/conversation.action";
dotenv.config();


export default class MessageService extends Service {
	private conversationAct: ConversationAction;

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.conversationAct = new ConversationAction();

		this.parseServiceSchema({
			name: "conversation",
			actions: {
				createConversation: {
					rest: {
						method: "POST",
						path: "/",
					},
					// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
					onBeforeCall(ctx: { params: { requestToken: any } }, _route: any, req: { headers: { [x: string]: any } }, _res: any) {
						// Set request headers to context meta
						ctx.params.requestToken = req.headers.Authorization;
					},
					handler: this.conversationAct.createConversation,
				},
				getConversationOfMine: {
					rest: {
						method: "GET",
						path: "/ofMine/:userId",
					},
					// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
					onBeforeCall(ctx: { params: { requestToken: any } }, _route: any, req: { headers: { [x: string]: any } }, _res: any) {
						// Set request headers to context meta
						ctx.params.requestToken = req.headers.Authorization;
					},
					handler:this.conversationAct.getConversationOfMine,
				},
				getConversationById: {
					rest: {
						method: "GET",
						path: "/:id",
					},
					// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
					onBeforeCall(ctx: { params: { requestToken: any } }, _route: any, req: { headers: { [x: string]: any } }, _res: any) {
						// Set request headers to context meta
						ctx.params.requestToken = req.headers.Authorization;
					},
					handler: this.conversationAct.getConversation,
				},
				updateConversationName: {
					rest: {
						method: "PUT",
						path: "/:id/Name",
					},
					// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
					onBeforeCall(ctx: { params: { requestToken: any } }, _route: any, req: { headers: { [x: string]: any } }, _res: any) {
						// Set request headers to context meta
						ctx.params.requestToken = req.headers.Authorization;
					},
					handler: this.conversationAct.updateConversationName,
				},
				updateConversationAvatar: {
					rest: {
						method: "PUT",
						path: "/:id/Avatar",
					},
					// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
					onBeforeCall(ctx: { params: { requestToken: any } }, _route: any, req: { headers: { [x: string]: any } }, _res: any) {
						// Set request headers to context meta
						ctx.params.requestToken = req.headers.Authorization;
					},
					handler: this.conversationAct.updateConversationAvatar,
				},
				addMemberToConversation: {
					rest: {
						method: "PUT",
						path: "/addMember/:conversation",
					},
					// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
					onBeforeCall(ctx: { params: { requestToken: any } }, _route: any, req: { headers: { [x: string]: any } }, _res: any) {
						// Set request headers to context meta
						ctx.params.requestToken = req.headers.Authorization;
					},
					handler: this.conversationAct.addMember,
				},
				removeMemberToConversation: {
					rest: {
						method: "PUT",
						path: "/removeMember/:conversation",
					},
					// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
					onBeforeCall(ctx: { params: { requestToken: any } }, _route: any, req: { headers: { [x: string]: any } }, _res: any) {
						// Set request headers to context meta
						ctx.params.requestToken = req.headers.Authorization;
					},
					handler: this.conversationAct.removeMember,
				},
			},
			// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
			async started(){
				try {
					await mongoose.connect( process.env.CHAT_DB_URI);
					console.log("conversation service: connected to DB");
				} catch (error) {
					console.log("connect error");
				}
			},
		});
	}
}


// GetConversations: async (req, res) => {
// 	Try {
// 		Const conversation = await Conversation.find({
// 			Members: req.userId,
// 		})
// 			.sort({ updatedAt: -1 })
// 			.populate({ path: 'members' });

// 		If (!conversation) {
// 			Res.status(404).json({ error: 'not found' });
// 			Return;
// 		}

// 		Res.json({ success: true, conversation });
// 	} catch (e) {
// 		Console.log(`api, ${e}`);
// 		Res.status(500).json({ error: e });
// 	}
// },

// AddMember: async (req, res) => {
// 	Const { usersId, conversationId } = req.body;
// 	Console.log(usersId);
// 	//simple validation

// 	Try {
// 		Const newConversation = await Conversation.findOneAndUpdate(
// 			{ _id: conversationId },
// 			{ $push: { members: { $each: usersId } } },
// 			{ new: true }
// 		).populate({ path: 'members' });
// 		Console.log(newConversation);

// 		Res.json({ success: true, message: 'add user successful', newConversation });
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// RemoveMember: async (req, res) => {
// 	Const { userId, conversationId } = req.body;

// 	Try {
// 		Const newConversation = await Conversation.findOneAndUpdate(
// 			{ _id: conversationId },
// 			{ $pull: { members: userId } },
// 			{
// 				New: true,
// 			}
// 		);

// 		Const removedMember = await User.findOne({
// 			_id: userId,
// 		});
// 		Res.json({ success: true, message: 'remove user successful', removedMember, newConversation });
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// CreateMessage: async (req, res) => {
// 	Try {
// 		Const newMessage = new Mess({
// 			Sender: req.body.userId,
// 			ConversationId: req.body.conversationId,
// 			Content: {
// 				Text: req.body.content,
// 				MessType: req.body.messType,
// 			},
// 			IsSeen: req.userId
// 		});

// 		Await newMessage.save();
// 		Const newBruh = await newMessage.populate({ path: 'sender' });

// 		Const conversation = await Conversation.findOneAndUpdate(
// 			{ _id: newMessage.conversationId },
// 			{
// 				UpdatedAt: Date.now(),
// 			}
// 		);

// 		Res.status(201).json({ success: true, message: 'save message', newMessage: newBruh });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// GetMessageInConversation: async (req, res) => {
// 	Try {
// 		Const { page } = req.query;
// 		Const messages = await Mess.find({
// 			ConversationId: req.params.id,
// 		})
// 			.populate({ path: 'sender' })
// 			.sort({ createdAt: -1 })
// 			.skip(10 * page)
// 			.limit(10);
// 		Res.status(200).json({ success: true, message: 'messages by conversation Id', messages });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// GetExistConversation: async (req, res) => {
// 	Const { users } = req.body;
// 	Const usersId = users.map((user) => user._id);
// 	Try {
// 		Const conversation = await Conversation.find({
// 			$and: [{ members: { $all: userId } }, { members: { $size: usersId.length } }],
// 		});

// 		Res.status(200).json({ success: true, message: 'existed conversation', conversation });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// GetMembersConversation: async (req, res) => {
// 	Try {
// 		Const conversation = await Conversation.findOne({
// 			_id: req.params.id,
// 		}).populate({ path: 'members' });
// 		Res.status(200).json({ success: true, message: 'existed conversation', members: conversation.members });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// RemoveConversation: async (req, res) => {
// 	Try {
// 		Const { conversationId } = req.body;
// 		Const conversation = await Conversation.findOneAndDelete({
// 			_id: conversationId,
// 		});

// 		Console.log(conversation);

// 		Const messages = await Mess.deleteMany({
// 			ConversationId: conversationId,
// 		});

// 		Res.json({ success: true, message: 'existed conversation', conversation });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// TymMessage: async (req, res) => {
// 	Try {
// 		Const userId = req.body.userId;
// 		Const messageId = req.body.messageId;
// 		Const newMessage = await Mess.findByIdAndUpdate(
// 			{ _id: messageId },
// 			{
// 				$push: { tym: userId },
// 			},
// 			{ new: true, upsert: true }
// 		).populate({ path: 'sender' });

// 		Res.json({ success: true, message: 'Tym successfully', newMessage });
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// ChangeConversationName: async (req, res) => {
// 	Const newName = req.body.newName;
// 	Console.log(newName);
// 	Try {
// 		Const newConversation = await Conversation.findOneAndUpdate(
// 			{ _id: req.params.id },
// 			{ $set: { name: newName } },
// 			{ new: true }
// 		).populate({ path: 'members' });

// 		Res.json({ success: true, message: 'Change name successfully', newConversation });
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },
// UnTymMessage: async (req, res) => {
// 	Try {
// 		Const userId = req.body.userId;
// 		Const messageId = req.body.messageId;
// 		Const newMessage = await Mess.findByIdAndUpdate(
// 			{ _id: messageId },
// 			{
// 				$pull: { tym: userId },
// 			},
// 			{ new: true, upsert: true }
// 		).populate({ path: 'sender' });

// 		Res.json({ success: true, message: 'Tym successfully', newMessage });
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// ChangeConversationAvatar: async (req, res) => {
// 	Const newAvt = req.body.newAvt;
// 	Console.log(newAvt);
// 	Try {
// 		Const newConversation = await Conversation.findOneAndUpdate(
// 			{ _id: req.params.id },
// 			{ $set: { avatar: newAvt } },
// 			{ new: true }
// 		).populate({ path: 'members' });

// 		Res.json({ success: true, message: 'Change avatar successfully', newConversation });
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// RemoveMessage: async (req, res) => {
// 	Try {
// 		Const { messageId } = req.params;
// 		Const deletedMessage = await Mess.findOneAndUpdate(
// 			{ _id: messageId },
// 			{ $set: { isDeleted: true } },
// 			{ new: true }
// 		).populate({ path: 'sender' });

// 		Res.json({ success: true, message: 'delete message successfully', deletedMessage });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// SeenAllMessages: async(req, res) => {
// 	Try {
// 		Const {conId} = req.params;
// 		Console.log('seen ', conId)
// 		Const seenAll = await Mess.updateMany(
// 			{ conversationId: conId },
// 			{ $addToSet: { isSeen: req.userId } },
// 			{ new: true }
// 		);

// 		Res.json({ success: true, message: 'delete message successfully', seenAll });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// SeenMessage: async(req, res) => {
// 	Try {
// 		Const {messId} = req.body
// 		Console.log('seen 1 mess ', messId)
// 		Const seenMessage = await Mess.findByIdAndUpdate(
// 			{ _id: messId },
// 			{ $addToSet: { isSeen: req.userId } },
// 			{ new: true }
// 		);

// 		Res.json({ success: true, message: 'delete message successfully', seenMessage });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		Console.log(error);
// 		Res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// }
