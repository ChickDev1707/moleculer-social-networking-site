import { Connection, HydratedDocument, Model, Types } from "mongoose";
import * as dotenv from "dotenv";
import { ICommentDTO } from "../dtos/comment.dto";
import CommentSchema from "../models/comment.schema";

dotenv.config();

export class CommentRepository {
	private CommentModel: Model<ICommentDTO>;
	public constructor(connection: Connection) {
		this.CommentModel = connection.model("comments", CommentSchema);
	}
	public async createComment(comment: ICommentDTO) {
		const newComment: HydratedDocument<ICommentDTO> = new this.CommentModel(comment);
		await newComment.save();
		return newComment;
	}

	public async updateComment(commentId: Types.ObjectId, content: string) {
		const modifiedAt = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
		const updatedComment = await this.CommentModel.findOneAndUpdate({ _id: commentId }, { content, modifiedAt }, { new: true });
		return updatedComment;
	}

	public async deleteComment(commentId: Types.ObjectId) {
		const deletedComment = await this.CommentModel.findOneAndDelete({ _id: commentId });
		return deletedComment;
	}

	public async getPostComments(postId: Types.ObjectId) {
		const comments = await this.CommentModel.find({ postId, parent: "x" }).populate("reply");
		return comments;
	}

	public async likeComment(commentId: Types.ObjectId, userId: string) {
		const likedComment = await this.CommentModel.findOneAndUpdate({ _id: commentId }, { $push: { likes: userId } }, { new: true });
		return likedComment;
	}

	public async dislikeComment(commentId: Types.ObjectId, userId: string) {
		const dislikedComment = await this.CommentModel.findOneAndUpdate({ _id: commentId }, { $pull: { likes: userId } }, { new: true });
		return dislikedComment;
	}

	// Helper
	public async isLikedComment(commentId: Types.ObjectId, userId: string) {
		const checkComment = await this.CommentModel.find({ _id: commentId, likes: userId });
		if (checkComment.length > 0) { return true; }
		return false;
	}

	public async pushNewCommentIdToParentComment(parentCommentId: Types.ObjectId, commentId: Types.ObjectId) {
		const commentResult = await this.CommentModel.findOneAndUpdate({ _id: parentCommentId }, { $push: { reply: commentId } }, { new: true });
		return commentResult;
	}

}
