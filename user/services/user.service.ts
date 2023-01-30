"use strict";
import { Service, ServiceBroker } from "moleculer";
import { UserAction } from "./actions/user.action";
import { FollowingDtoSchema } from "./dtos/following.dto";
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
				// Profile
				/**
				 * Follow other users
				 * @param {params} params
				 */
				getUser: {
					rest: {
						method: "GET",
						path: "/:userId",
					},
					params: { userId: "string" },
					handler: this.userAction.getUserInfo,
				},
				// Search user
				/**
				 * Search other users
				 * @param {params} params
				 */
				searchUsers: {
					rest: {
						method: "GET",
						path: "/:input",
					},
					params: {input: "string"},
					handler: this.userAction.searchUsers,
				},
				// Follow
				/**
				 * Follow other users
				 * @param {params} params
				 */
				editFollowing: {
					rest: {
						method: "PATCH",
						path: "/:userId/followings",
					},
					params: FollowingDtoSchema,
					handler: this.userAction.editFollowing,
				},

				/**
				 * Get followings list. “Following” is the term for the users who you follow.
				 * @param {params} params
				 */
				getFollowings: {
					rest: {
						method: "GET",
						path: "/:userId/followings",
					},
					params: { userId: "string" },
					handler: this.userAction.getFollowings,
				},

				/**
				 * Get followers list, "Followers" are the users who follow you
				 * @param {params} params
				 */
				getFollowers: {
					rest: {
						method: "GET",
						path: "/:userId/followers",
					},
					params: { userId: "string" },
					handler: this.userAction.getFollowers,
				},

				/**
				 * Get recommended followings
				 * @param {params} params
				 */
				 getRecommendedFollowings: {
					rest: {
						method: "GET",
						path: "/:userId/recommend",
					},
					params: { userId: "string" },
					handler: this.userAction.getRecommendedFollowings,
				},

				// Auth
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
