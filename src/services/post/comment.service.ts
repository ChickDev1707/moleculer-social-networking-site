"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import DbService from "moleculer-db";
import MongooseDbAdapter from "moleculer-db-adapter-mongoose";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import CommentAction from "./actions/comment.action";

dotenv.config();

export default class CommentService extends Service{
	private commentAct: CommentAction;

	public constructor(public broker: ServiceBroker){
		super(broker);
		this.commentAct = new CommentAction();
		this.parseServiceSchema({
			name: "comments",
			actions:{
				getComments: {
					rest: {
						method:"GET",
						path: "/",
					},
					handler: this.commentAct.getcomments,
				},

				createComment:{
					rest: {
						method: "POST",
						path: "/",
					},
					handler: this.commentAct.createComment,
				},

				updateComment: {
					rest: {
						method: "PATCH",
						path: "/",
					},
					handler: this.commentAct.updateComment,
				},

				deleteComment: {
					rest: {
						method: "DELETE",
						path: "/",
					},
					handler: this.commentAct.deleteComment,
				},

				reactComment: {
					rest: {
						method: "PATCH",
						path: "/react",
					},
					handler: this.commentAct.reactComment,
				},

				// Helper service
				pushNewCommentIdToParentComment: {
					rest: {
						method: "PATCH",
						path: "/helper/push-new-coment-id-to-parent-comment",
					},
					handler: this.commentAct.pushNewCommentIdToParentComment,
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

