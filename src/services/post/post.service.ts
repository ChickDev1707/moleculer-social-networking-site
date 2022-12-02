"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import DbService from "moleculer-db";
import MongooseDbAdapter from "moleculer-db-adapter-mongoose";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import PostAction from "./actions/post.action";
import postModel from "./models/post.model";

dotenv.config();

export default class PostService extends Service{
	private postAct: PostAction;

	public constructor(public broker: ServiceBroker){
		super(broker);
		this.postAct = new PostAction();
		this.parseServiceSchema({
			name: "posts",
			actions:{
				// Main service
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
						path:"/",
					},
					handler: this.postAct.updatePost,
				},

				deletePost: {
					rest: {
						method: "DELETE",
						path: "/",
					},
					handler: this.postAct.deletePost,
				},

				getPosts: {
					rest: {
						method: "GET",
						path: "/",
					},
					handler: this.postAct.getPosts,
				},

				getPostsByUserId: {
					rest: {
						method:"GET",
						path: "/user",
					},
					handler: this.postAct.getPostsByUserId,

				},

				getPostsById: {
					rest: {
						method:"GET",
						path: "/post",
					},
					handler: this.postAct.getPostsById,
				},

				likePost: {
					rest: {
						method: "PATCH",
						path: "/post/like",
					},
					handler: this.postAct.likePost,
				},

				unlikePost: {
					rest: {
						method: "PATCH",
						path: "/post/unlike",
					},
					handler: this.postAct.unlikePost,
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

