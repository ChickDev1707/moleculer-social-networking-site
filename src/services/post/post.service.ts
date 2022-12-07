"use strict";

import { Service, ServiceBroker } from "moleculer";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import PostAction from "./actions/post.action";
import CommentAction from "./actions/comment.action";

dotenv.config();

export default class PostService extends Service {
	private postAct: PostAction;
	private commentAct: CommentAction;
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.postAct = new PostAction();
		this.commentAct = new CommentAction();
		this.parseServiceSchema({
			name: "posts",
			actions: {
				// Post service
				// Recommend post for user in home page
				getHomePosts: {
					rest: {
						method: "GET",
						path: "/home",
					},
					params: { userId: "string" },
					handler: this.postAct.getHomePosts,
				},
				// Get all post of a user
				getUserPosts: {
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
						path: "/:postId",
					},
					params: { postId: "string"},
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
						path: "/:postId",
					},
					params: { postId: "string"},
					handler: this.postAct.updatePost,
				},

				deletePost: {
					rest: {
						method: "DELETE",
						path: "/:postId",
					},
					params: { postId: "string"},
					handler: this.postAct.deletePost,
				},

				likePost: {
					rest: {
						method: "PATCH",
						path: "/:postId/like",
					},
					params: { postId: "string"},
					handler: this.postAct.likePost,
				},

				unlikePost: {
					rest: {
						method: "PATCH",
						path: "/:postId/unlike",
					},
					params: { postId: "string"},
					handler: this.postAct.unlikePost,
				},

				// Comment service
				// Get all comments of a post
				getPostComments: {
					rest: {
						method:"GET",
						path: "/:postId/comments",
					},
					params: { postId: "string"},
					handler: this.commentAct.getPostcomments,
				},

				createComment:{
					rest: {
						method: "POST",
						path: "/:postId/comments",
					},
					params: { postId: "string"},
					handler: this.commentAct.createComment,
				},

				updateComment: {
					rest: {
						method: "PATCH",
						path: "/:postId/comments/:commentId",
					},
					params: {
						postId: "string",
						commentId: "string",
					},
					handler: this.commentAct.updateComment,
				},

				deleteComment: {
					rest: {
						method: "DELETE",
						path: "/:postId/comments/:commentId",
					},
					params: {
						postId: "string",
						commentId: "string",
					},
					handler: this.commentAct.deleteComment,
				},

				likeComment: {
					rest: {
						method: "PATCH",
						path: "/:postId/comments/:commentId/like",
					},
					params: {
						postId: "string",
						commentId: "string",
					},
					handler: this.commentAct.likeComment,
				},

				unlikeComment: {
					rest: {
						method: "PATCH",
						path: "/:postId/comments/:commentId/unlike",
					},
					params: {
						postId: "string",
						commentId: "string",
					},
					handler: this.commentAct.unlikeComment,
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

