/* eslint-disable no-underscore-dangle */
import mongoose, { Connection } from "mongoose";
const { Types } = mongoose;
import { BrokerNode, Context, Errors, ServiceBroker } from "moleculer";
import { ICommentDTO } from "../dtos/comment.dto";
import { CommentRepository } from "../repository/comment.repository";
import { PostRepository } from "../repository/post.repository";
import { IApiResponse } from "../types/api.type";
import { TypeNotification } from "../enum/type-notification.enum";

export default class CommentAction {
	private postRepo: PostRepository;
	private commentRepo: CommentRepository;
	public constructor(connection: Connection) {
		this.postRepo = new PostRepository(connection);
		this.commentRepo = new CommentRepository(connection);
	}

	public getPostComments = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const comments: ICommentDTO[] = await this.commentRepo.getPostComments(ctx.params.postId);
			const finalComments = [];
			for (const comment of comments) {
				const finalComment = await getFullDetailComment(ctx, comment);
				finalComments.push(finalComment);
			}
			return {
				message: "Successful request",
				code: 200,
				data: finalComments,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public createComment = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			if (!ctx.params.content) {
				return {
					message: "Content is require",
					code: 400,
				};
			};
			const commentTemp: ICommentDTO = {
				content: ctx.params.content,
				user: ctx.params.userId,
				postId: ctx.params.postId,
				tag: ctx.params.tag ? ctx.params.tag : [],
				reply: ctx.params.reply ? ctx.params.reply : [],
				parent: ctx.params.parentCommentId ? ctx.params.parentCommentId : "x",
				likes: ctx.params.likes ? ctx.params.likes : [],
				postUserId: ctx.params.postUserId,
				createdAt: new Date((new Date()).getTime()),
				modifiedAt: new Date((new Date()).getTime()),
			};
			const newComment = await this.commentRepo.createComment(commentTemp);
			// Push newCommentId to post-->comments
			const postId = ctx.params.postId;
			const commentId = newComment.id;
			await this.postRepo.pushNewCommentIdToPost(postId, commentId);
			// If newComment have parentComment, push newCommentId to "reply" of parentComment
			if (ctx.params.parentCommentId) {
				const parentCommentId = ctx.params.parentCommentId;
				await this.commentRepo.pushNewCommentIdToParentComment(parentCommentId, commentId);
			};
			// Popupate user
			const finalNewComment = await getFullDetailComment(ctx, newComment);

			ctx.broker.logger.error(finalNewComment);
			
			//Create notification
			if(finalNewComment.user.id != finalNewComment.postUserId){
				ctx.broker.broadcast("notification.create", {
					from: finalNewComment.user.id,
					to: finalNewComment.postUserId,
					type: TypeNotification.COMMENT,
					content: "Đã bình luận bài viết của bạn",
					link: `/user/${ctx.params.userId}`,
				});
			}

			return {
				message: "Successful request",
				code: 200,
				data: finalNewComment,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public updateComment = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			if (!ctx.params.content) {
				return {
					message: "Content is require",
					code: 400,
				};
			};
			const { commentId, content } = ctx.params;
			const updatedComment = await this.commentRepo.updateComment(commentId, content);
			return {
				message: "Updated comment",
				code: 200,
				data: updatedComment,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public deleteComment = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const { postId, commentId } = ctx.params;
			const deletedComment = await this.commentRepo.deleteComment(commentId);
			// Delete commentId in post
			await this.postRepo.pullDeletedCommentIdInPost(postId, commentId);
			return {
				message: "Deleted comment",
				code: 200,
				data: deletedComment,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public likeComment = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const { userId, commentId } = ctx.params;
			const likedComment = await this.commentRepo.likeComment(commentId, userId);
			const finalComment = await getFullDetailComment(ctx, likedComment);
			if(userId != likedComment.user){
				ctx.broker.broadcast("notification.create", {
					from: userId,
					to: likedComment.user,
					type: TypeNotification.LIKE_COMMENT,
					content: "Đã thích bình luận của bạn",
					link: `/user/${ctx.params.userId}`,
				});
			}

			return {
				message: "liked comment",
				code: 200,
				data: finalComment,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public unlikeComment= async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const { userId, commentId } = ctx.params;
			const dislikedComment = await this.commentRepo.unlikeComment(commentId, userId);
			const finalComment = await getFullDetailComment(ctx, dislikedComment);
			return {
				message: "unliked comment",
				code: 200,
				data: finalComment,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};
}

// Sub function
export const getFullDetailComment = async (ctx: any, comment: any) => {
	try {
		// Get user info
		const userInfoResponse: IApiResponse = await ctx.broker.call("users.getUser", { userId: comment.user });
		// Return final comment
		const finalComment = {
			...comment._doc,
			...{ user: userInfoResponse.data },
		};
		return finalComment;
	} catch (error) {
		throw new Errors.MoleculerError("Internal server error", 500);
	}
};
