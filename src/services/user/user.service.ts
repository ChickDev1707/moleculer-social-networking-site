"use strict";
import { Service, ServiceBroker} from "moleculer";
import { UserAction } from "./actions/user.action";
import { LoginDtoSchema } from "./dtos/login.dto";
import { RegisterDtoSchema } from "./dtos/register.dto";

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
				login: {
					rest: {
						method: "POST",
						path: "/login",
					},
					params: LoginDtoSchema,
					handler: this.userAction.login,
				},
				register: {
					rest: {
						method: "POST",
						path: "/register",
					},
					params: RegisterDtoSchema,
					handler: this.userAction.register,
				},
			},
		});
	}
}
