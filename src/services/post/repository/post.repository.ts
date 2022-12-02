import mongoose, { HydratedDocument, Types } from "mongoose";
import * as dotenv from "dotenv";
import { IPostDTO } from "../dtos/post.dto";
import postModel from "../models/post.model";

dotenv.config();

export class PostRepository {
	public async createPost(post: IPostDTO) {
		const newPost: HydratedDocument<IPostDTO> = new postModel(post);
		await newPost.save();
		return newPost;
	}

	public async updatePost(
		postId: Types.ObjectId,
		content: string,
		images?: string[]
	) {
		if (images) {
			const updatedPost = await postModel.findOneAndUpdate(
				{ _id: postId },
				{ content, images },
				{ new: true }
			);
			return updatedPost;
		} else {
			const updatedPost = await postModel.findOneAndUpdate(
				{ _id: postId },
				{ content },
				{ new: true }
			);
			return updatedPost;
		}
	}

	public async deletePost(postId: Types.ObjectId) {
		const deletedPost = await postModel.findByIdAndDelete(postId);
		return deletedPost;
	}

	public async getPosts(user: any) {
		let finalPosts: IPostDTO[] = [];
		for (const userId of user.following) {
			const posts = await postModel.find({ user: userId });
			finalPosts = [...finalPosts, ...posts];
		}
		finalPosts = finalPosts.sort(
			(objA, objB) => Number(objB.createdAt) - Number(objA.createdAt)
		);
		return finalPosts;
	}

	public async getPostByUserId(userId: Types.ObjectId) {
		const posts = await postModel.find({ user: userId });
		return posts;
	}

	public async getPostById(postId: Types.ObjectId) {
		const post = await postModel.findById(postId);
		return post;
	}

	public async likePost(postId: Types.ObjectId, userId: Types.ObjectId) {
		const likedPost = await postModel.findOneAndUpdate(
			{ _id: postId },
			{ $push: { likes: userId } },
			{ new: true }
		);
		return likedPost;
	}

	public async unlikePost(postId: Types.ObjectId, userId: Types.ObjectId) {
		const unlikedPost = await postModel.findOneAndUpdate(
			{ _id: postId },
			{ $pull: { likes: userId } },
			{ new: true }
		);
		return unlikedPost;
	}

	// Helper
	public async pushNewCommentIdToPost(
		postId: Types.ObjectId,
		commentId: Types.ObjectId
	) {
		const result = await postModel.findOneAndUpdate(
			{ _id: postId },
			{ $push: { comments: commentId } },
			{ new: true }
		);
		return result;
	}

	public async pullDeletedCommentIdInPost(
		postId: Types.ObjectId,
		commentId: Types.ObjectId
	) {
		const result = await postModel.findOneAndUpdate(
			{ _id: postId },
			{ $pull: { comments: commentId } },
			{ new: true }
		);
		return result;
	}
}
