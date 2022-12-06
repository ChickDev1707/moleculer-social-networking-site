"use strict";

import { Service, ServiceBroker } from "moleculer";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import PostAction from "./actions/post.action";

dotenv.config();

// Post service for user
export default class PostService extends Service {
	private postAct: PostAction;

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.postAct = new PostAction();
		this.parseServiceSchema({
			name: "posts",
			actions: {
				// Main service
				// User post routes
				getPost: {
					rest: {
						method: "GET",
						path: "/",
					},
					params: { userId: "string" },
					handler: this.postAct.getUserPosts,
				},

				getPostById: {
					rest: {
						method: "GET",
						path: "/:id",
					},
					handler: this.postAct.getPostById,
				},

				createPost: {
					rest: {
						method: "POST",
						path: "/",
					},
					handler: this.postAct.createPost,
				},

				updatePost: {
					rest: {
						method: "PATCH",
						path: "/:id",
					},
					// Params
					handler: this.postAct.updatePost,
				},

				deletePost: {
					rest: {
						method: "DELETE",
						path: "/:id",
					},
					// Params
					handler: this.postAct.deletePost,
				},
				// Recommend post for user in home page
				getHomePosts: {
					rest: {
						method: "GET",
						path: "/home",
					},
					params: { userId: "string" },
					handler: this.postAct.getHomePosts,
				},
				// Post actions
				likePost: {
					rest: {
						method: "PATCH",
						path: "/:id/like",
					},
					handler: this.postAct.likePost,
				},

				unlikePost: {
					rest: {
						method: "PATCH",
						path: "/:id/unlike",
					},
					handler: this.postAct.unlikePost,
				},

				getListUserInfoLikedPost: {
					rest: {
						method: "GET",
						path: "/post/:postId/list-user-info-like-post",
					},
					params: {postId: "string"},
					handler: this.postAct.getListUserInfoLikedPost,
				},
			},

			// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
			async started(): Promise<void> {
				try {
					await mongoose.connect(process.env.MONGODB_URI);
				} catch (error) {
					console.log(error);
				}
			},
		});
	}
}

