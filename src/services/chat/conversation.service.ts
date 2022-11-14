import {Service, ServiceBroker, Context} from "moleculer";
import DbService from "moleculer-db";
import MongooseDbAdapter from "moleculer-db-adapter-mongoose";
import ConversationAction  from "./actions/conversation.action";
import conversationModel from "./models/conversation.model";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
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
					handler: this.conversationAct.createConversation,
				},
				getConversationOfMine: {
					rest: {
						method: "GET",
						path: "/ofMine/:userId",
					},
					handler:this.conversationAct.getConversationOfMine
				},
				getConversationById: {
					rest: {
						method: "GET",
						path: "/:id",
					},
					handler: this.conversationAct.getConversation
				},
				addMemberToConversation: {
					rest: {
						method: "PUT",
						path: "/addMember/:conversation",
					},
					handler: this.conversationAct.addMember
				},
				removeMemberToConversation: {
					rest: {
						method: "PUT",
						path: "/removeMember/:conversation",
					},
					handler: this.conversationAct.removeMember
				},
			},
			async started() {
				try {
					await mongoose.connect( process.env.MONGODB_URI);
					console.log("conversation service: connected to DB")
				} catch (error) {
					console.log("connect error")
				}
				
			}
		});
	}
}



// getConversations: async (req, res) => {
// 	try {
// 		const conversation = await Conversation.find({
// 			members: req.userId,
// 		})
// 			.sort({ updatedAt: -1 })
// 			.populate({ path: 'members' });

// 		if (!conversation) {
// 			res.status(404).json({ error: 'not found' });
// 			return;
// 		}

// 		res.json({ success: true, conversation });
// 	} catch (e) {
// 		console.log(`api, ${e}`);
// 		res.status(500).json({ error: e });
// 	}
// },

// addMember: async (req, res) => {
// 	const { usersId, conversationId } = req.body;
// 	console.log(usersId);
// 	//simple validation

// 	try {
// 		const newConversation = await Conversation.findOneAndUpdate(
// 			{ _id: conversationId },
// 			{ $push: { members: { $each: usersId } } },
// 			{ new: true }
// 		).populate({ path: 'members' });
// 		console.log(newConversation);

// 		res.json({ success: true, message: 'add user successful', newConversation });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// removeMember: async (req, res) => {
// 	const { userId, conversationId } = req.body;

// 	try {
// 		const newConversation = await Conversation.findOneAndUpdate(
// 			{ _id: conversationId },
// 			{ $pull: { members: userId } },
// 			{
// 				new: true,
// 			}
// 		);

// 		const removedMember = await User.findOne({
// 			_id: userId,
// 		});
// 		res.json({ success: true, message: 'remove user successful', removedMember, newConversation });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// createMessage: async (req, res) => {
// 	try {
// 		const newMessage = new Mess({
// 			sender: req.body.userId,
// 			conversationId: req.body.conversationId,
// 			content: {
// 				text: req.body.content,
// 				messType: req.body.messType,
// 			},
// 			isSeen: req.userId
// 		});

// 		await newMessage.save();
// 		const newBruh = await newMessage.populate({ path: 'sender' });

// 		const conversation = await Conversation.findOneAndUpdate(
// 			{ _id: newMessage.conversationId },
// 			{
// 				updatedAt: Date.now(),
// 			}
// 		);

// 		res.status(201).json({ success: true, message: 'save message', newMessage: newBruh });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// getMessageInConversation: async (req, res) => {
// 	try {
// 		const { page } = req.query;
// 		const messages = await Mess.find({
// 			conversationId: req.params.id,
// 		})
// 			.populate({ path: 'sender' })
// 			.sort({ createdAt: -1 })
// 			.skip(10 * page)
// 			.limit(10);
// 		res.status(200).json({ success: true, message: 'messages by conversation Id', messages });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// getExistConversation: async (req, res) => {
// 	const { users } = req.body;
// 	const usersId = users.map((user) => user._id);
// 	try {
// 		const conversation = await Conversation.find({
// 			$and: [{ members: { $all: userId } }, { members: { $size: usersId.length } }],
// 		});

// 		res.status(200).json({ success: true, message: 'existed conversation', conversation });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// getMembersConversation: async (req, res) => {
// 	try {
// 		const conversation = await Conversation.findOne({
// 			_id: req.params.id,
// 		}).populate({ path: 'members' });
// 		res.status(200).json({ success: true, message: 'existed conversation', members: conversation.members });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// removeConversation: async (req, res) => {
// 	try {
// 		const { conversationId } = req.body;
// 		const conversation = await Conversation.findOneAndDelete({
// 			_id: conversationId,
// 		});

// 		console.log(conversation);

// 		const messages = await Mess.deleteMany({
// 			conversationId: conversationId,
// 		});

// 		res.json({ success: true, message: 'existed conversation', conversation });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// tymMessage: async (req, res) => {
// 	try {
// 		const userId = req.body.userId;
// 		const messageId = req.body.messageId;
// 		const newMessage = await Mess.findByIdAndUpdate(
// 			{ _id: messageId },
// 			{
// 				$push: { tym: userId },
// 			},
// 			{ new: true, upsert: true }
// 		).populate({ path: 'sender' });

// 		res.json({ success: true, message: 'Tym successfully', newMessage });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// changeConversationName: async (req, res) => {
// 	const newName = req.body.newName;
// 	console.log(newName);
// 	try {
// 		const newConversation = await Conversation.findOneAndUpdate(
// 			{ _id: req.params.id },
// 			{ $set: { name: newName } },
// 			{ new: true }
// 		).populate({ path: 'members' });

// 		res.json({ success: true, message: 'Change name successfully', newConversation });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },
// unTymMessage: async (req, res) => {
// 	try {
// 		const userId = req.body.userId;
// 		const messageId = req.body.messageId;
// 		const newMessage = await Mess.findByIdAndUpdate(
// 			{ _id: messageId },
// 			{
// 				$pull: { tym: userId },
// 			},
// 			{ new: true, upsert: true }
// 		).populate({ path: 'sender' });

// 		res.json({ success: true, message: 'Tym successfully', newMessage });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// changeConversationAvatar: async (req, res) => {
// 	const newAvt = req.body.newAvt;
// 	console.log(newAvt);
// 	try {
// 		const newConversation = await Conversation.findOneAndUpdate(
// 			{ _id: req.params.id },
// 			{ $set: { avatar: newAvt } },
// 			{ new: true }
// 		).populate({ path: 'members' });

// 		res.json({ success: true, message: 'Change avatar successfully', newConversation });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// removeMessage: async (req, res) => {
// 	try {
// 		const { messageId } = req.params;
// 		const deletedMessage = await Mess.findOneAndUpdate(
// 			{ _id: messageId },
// 			{ $set: { isDeleted: true } },
// 			{ new: true }
// 		).populate({ path: 'sender' });

// 		res.json({ success: true, message: 'delete message successfully', deletedMessage });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// },

// seenAllMessages: async(req, res) => {
// 	try {
// 		const {conId} = req.params;
// 		console.log('seen ', conId)
// 		const seenAll = await Mess.updateMany(
// 			{ conversationId: conId },
// 			{ $addToSet: { isSeen: req.userId } },
// 			{ new: true }
// 		);

// 		res.json({ success: true, message: 'delete message successfully', seenAll });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// }, 

// seenMessage: async(req, res) => {
// 	try {
// 		const {messId} = req.body
// 		console.log('seen 1 mess ', messId)
// 		const seenMessage = await Mess.findByIdAndUpdate(
// 			{ _id: messId },
// 			{ $addToSet: { isSeen: req.userId } },
// 			{ new: true }
// 		);

// 		res.json({ success: true, message: 'delete message successfully', seenMessage });
// 		//socket.emit('sendMessage', newMessage)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// }