"use strict";

import { driver, auth } from 'neo4j-driver'
import { Service, ServiceBroker, Context } from "moleculer";
import { CreateUserDto } from './dtos/create-user.dto';
import { inspect } from 'util';
import { AddFriendDto } from './dtos/add-friend.dto';


export default class GreeterService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		let driverIns = driver('bolt://localhost:7687', auth.basic('neo4j', 'sudo'));
		let session = driverIns.session()

		this.parseServiceSchema({
			name: "users",
			actions: {
				/**
				 * create new user
				 * @param {Number} params 
				 */
				create: {
					rest: {
						method: "POST",
						path: "/",
					},
					body: {
						user: "CreateUserDto"
					},
					async handler(ctx: Context<{ user: CreateUserDto }>): Promise<string> {
						try {
							const query = `Create (:User ${inspect(ctx.params.user)})`
							session
								.run(query)
								.then(() => { console.log('add user') })
								.catch((err) => console.log(err))
							return query
						} catch (err) {
							console.log(err)
						}
					},
				},
				addFriend: {
					rest: {
						method: "POST",
						path: ":userId/friends",
					},
					body: {
						friendId: "string"
					},
					async handler(ctx: Context<AddFriendDto>): Promise<string> {
						try {
							const query = `	Match (user:User)
															WHERE ID(user) = ${ctx.params.userId}
															Match (friend:User)
															WHERE ID(friend) = ${ctx.params.friendId}
															Merge (user)-[:HAS_FRIEND]->(friend)
															return friend
														`
							session
								.run(query)
								.then(() => { console.log('add friend') })
								.catch((err) => console.log(err))
							return query
						} catch (err) {
							console.log(err)
						}
					},
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
