/* eslint-disable no-underscore-dangle */
import { Errors, Service, ServiceBroker } from "moleculer";
import SocketIOService from "moleculer-io";
import { IApiResponse } from "../../../configs/api.type";
import { UserModel } from "../user/types/models";
import { IConversationDTO, IMemberDTO } from "./dtos/conversation.dto";
import { INewMessageDTO, ISeenConMessages } from "./dtos/message.dto";

export default class MessageService extends Service {
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "io",
			mixins: [SocketIOService],
			settings: {
				port: 3003,
				logClientConnection: "warn",
				logBroadcastRequest: "warn",
				cors: {
					origin: "*",
					methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "*"],
					allowedHeaders: [
						"Access-Control-Allow-Origin", "*",
					],
					exposedHeaders: [],
					credentials: false,
					maxAge: 3600,
				},
				io: {
					namespaces: {
						"/": {
							events: {
								call: {
									whitelist: [
										"conversations.*",
										"socketServer.*",
										"rooms.*",
										"io.*",
									],
								},
								async createConversation(data: IConversationDTO) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												"conversations.createConversation",
												data
											) as IApiResponse;
										if (result.code === 201) {
											let socketRooms = socket.server;
											result.data.members.forEach((mem: UserModel.User) => {
												console.log("conversation member", mem);
												socketRooms = socketRooms.to(mem.id);
											});
											socketRooms.emit("newConversation", result.data);
										}
									} catch (error) {
										socket.emit("error", "error");
										console.log(error);
										throw new Errors.MoleculerError(
											"Internal server error",
											500
										);
									}
								},
								async updateConversation(
									action: string,
									data: any
								) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												action,
												data
											);
										if (result.code === 201) {
											// socket.emit(
											// 	"updateConversation",
											// 	result.data
											// );
											// socket.broadcast.emit(
											// 	"updateConversation",
											// 	result.data
											// );
											socket.server.to(result.data._id.toString()).emit("updateConversation", result.data);

										}
									} catch {
										socket.emit("error", "error");
										throw new Errors.MoleculerError(
											"Internal server error",
											500
										);
									}
								},
								async leaveConversation(data: IMemberDTO) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												"conversations.removeMemberToConversation",
												data
											) as IApiResponse;
										if (result.code === 201) {
											socket.server.to(result.data._id.toString()).emit("leaveConversation", result.data);
										}
									} catch {
										socket.emit("error", "error");
										throw new Errors.MoleculerError(
											"Internal server error",
											500
										);
									}
								},
								async seenAllMessage(data: ISeenConMessages) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												"messages.seenAllMessage",
												data
											);
										if (result.code === 201) {
											socket.emit(
												"seenAllMessage",
												result.data
											);
											socket.server.to(result.data.conversation.toString()).emit("updateMessage", result.data);
										}
									} catch {
										socket.emit("error", "error");
										throw new Errors.MoleculerError(
											"Internal server error",
											500
										);
									}
								},
								async createMessage(data: INewMessageDTO) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												"messages.createRest",
												data
											);
										if (result.code === 201) {
											socket.server.to(result.data.conversation.toString()).emit("newMessage", result.data);
										}
									} catch (error) {
										console.log(error);
										socket.emit("error", "error");
										throw new Errors.MoleculerError(
											"Internal server error",
											500
										);
									}
								},
								async updateMessage(
									action: string,
									data: any
								) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												action,
												data
											);
										if (result.code === 201) {
											socket.server.to(result.data.conversation.toString()).emit("updateMessage", result.data);
										}
									} catch {
										socket.emit("error", "error");
										throw new Errors.MoleculerError(
											"Internal server error",
											500
										);
									}
								},
							},
						},
					},
				},
			},
		});
	}
}
