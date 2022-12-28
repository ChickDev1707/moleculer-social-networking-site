"use strict";

import { Service, ServiceBroker } from "moleculer";
import * as dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";
import PostAction from "./actions/post.action";
import CommentAction from "./actions/comment.action";
import { LikePostDtoSchema } from "./dtos/like-post.dto";
import { UpdatePostDtoSchema } from "./dtos/update-post.dto";
dotenv.config();

export default class PostService extends Service {
	private dbConnection: Connection = mongoose.createConnection(process.env.POST_DB_URI);
	private postAct: PostAction = new PostAction(this.dbConnection);
	private commentAct: CommentAction = new CommentAction(this.dbConnection);
	public constructor(public broker: ServiceBroker) {
		super(broker);
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
					params: UpdatePostDtoSchema,
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

				dislikePost: {
					rest: {
						method: "PATCH",
						path: "/:postId/dislike",
					},
					params: LikePostDtoSchema,
					handler: this.postAct.dislikePost,
				},

				// Comment service
				// Get all comments of a post
				getPostComments: {
					rest: {
						method:"GET",
						path: "/:postId/comments",
					},
					params: { postId: "string"},
					handler: this.commentAct.getPostComments,
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

				dislikeComment: {
					rest: {
						method: "PATCH",
						path: "/:postId/comments/:commentId/dislike",
					},
					params: {
						postId: "string",
						commentId: "string",
					},
					handler: this.commentAct.dislikeComment,
				},
			},
			stopped: () => {
				this.dbConnection.close();
				this.logger.info("post service: disconnect DB");
			},
		});
	}
}

