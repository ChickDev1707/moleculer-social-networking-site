"use strict";
import { Service, ServiceBroker, Context, Errors } from "moleculer";
import { AddFriendDto } from "./dtos/add-friend.dto";
import { CreateUserDtoSchema } from "./dtos/create-user.dto";
import { UserAction } from "./actions/user.action";

export default class UserService extends Service {

	private userAction: UserAction;
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.userAction = new UserAction();

		this.parseServiceSchema({
			name: "users",
			actions: {
				/**
				 * Create new user
				 * @param {Number} params
				 */
				create: {
					rest: {
						method: "POST",
						path: "/",
					},
					params: CreateUserDtoSchema,
					handler: this.userAction.createUser,
				},
				addFriend: {
					rest: {
						method: "POST",
						path: ":userId/friends",
					},
					body: {
						friendId: "string",
					},
					handler: async (ctx: Context<AddFriendDto>): Promise<string> => "add friend",
				},

			},
		});
	}
	// Action
	public ActionHello(): string {
		return "Hello Moleculer";
	}

	public ActionWelcome(name: string): string {
		return `Welcome, ${name}`;
	}
}
