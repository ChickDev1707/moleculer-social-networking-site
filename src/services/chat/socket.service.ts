/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Errors, Service, ServiceBroker } from "moleculer";
import SocketIOService from "moleculer-io";

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
					origin: ["http://localhost:3006", "*"],
					methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "*"],
					allowedHeaders: [],
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
										"conversation.*",
										"socketServer.*",
										"rooms.*",
										"io.*",
									],
									async onBeforeCall(
										ctx: any,
										socket: any,
										action: any,
										params: any,
										callOptions: any
									) {
										ctx.meta.socketid = socket.id;
										ctx.meta.action = action;
										console.log("before hook:", params);
									},
								},
								async createConversation(data: any, ack: any) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												"conversation.createConversation",
												data
											);
										if (result.code === 201) {
											socket.emit(
												"newConversation",
												result.data
											);
											socket.broadcast.emit(
												"newConversation",
												result.data
											);
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
									action: any,
									data: any,
									ack: any
								) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												action,
												data
											);
										if (result.code === 201) {
											socket.emit(
												"updateConversation",
												result.data
											);
											socket.broadcast.emit(
												"updateConversation",
												result.data
											);
										}
									} catch {
										socket.emit("error", "error");
										throw new Errors.MoleculerError(
											"Internal server error",
											500
										);
									}
								},
								async leaveConversation(data: any, ack: any) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												"conversation.removeMemberToConversation",
												data
											);
										if (result.code === 201) {
											socket.emit(
												"leaveConversation",
												result.data
											);
											socket.broadcast.emit(
												"leaveConversation",
												result.data
											);
										}
									} catch {
										socket.emit("error", "error");
										throw new Errors.MoleculerError(
											"Internal server error",
											500
										);
									}
								},
								async seenAllMessage(data: any, ack: any) {
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
										}
									} catch {
										socket.emit("error", "error");
										throw new Errors.MoleculerError(
											"Internal server error",
											500
										);
									}
								},
								async createMessage(data: any, ack: any) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												"messages.createRest",
												data
											);
										if (result.code === 201) {
											socket.emit(
												"newMessage",
												result.data
											);
											socket.broadcast.emit(
												"newMessage",
												result.data
											);
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
									action: any,
									data: any,
									ack: any
								) {
									const socket = this;
									try {
										const result =
											await socket.$service.broker.call(
												action,
												data
											);
										if (result.code === 201) {
											console.log("result", result.data);
											socket.emit(
												"updateMessage",
												result.data
											);
											socket.broadcast.emit(
												"newMessage",
												result.data
											);
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
