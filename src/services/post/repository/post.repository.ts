import mongoose, { Connection, HydratedDocument, Model, Types } from "mongoose";
import * as dotenv from "dotenv";
import { IPostDTO } from "../dtos/post.dto";
import PostSchema from "../models/post.schema";

dotenv.config();

export class PostRepository {
	private PostModel: any;
	public constructor(connection: Connection) {
		this.PostModel = connection.model("posts", PostSchema);
	}

	public async createPost(post: IPostDTO) {
		const newPost: HydratedDocument<IPostDTO> = new this.PostModel(post);
		await newPost.save();
		return newPost;
	}

	public async updatePost(
		postId: Types.ObjectId,
		content: string,
		images?: string[]
	) {
		if (images) {
			const updatedPost = await this.PostModel.findOneAndUpdate(
				{ _id: postId },
				{ content, images },
				{ new: true }
			);
			return updatedPost;
		} else {
			const updatedPost = await this.PostModel.findOneAndUpdate(
				{ _id: postId },
				{ content },
				{ new: true }
			);
			return updatedPost;
		}
	}

	public async deletePost(postId: Types.ObjectId) {
		const deletedPost = await this.PostModel.findByIdAndDelete(postId);
		return deletedPost;
	}

	public async getFollowingsPosts(listFollowings: any) {
		try {
			let finalPosts: any[] = [];
			for (const user of listFollowings) {
				const posts = await this.PostModel.find({ user: user.id });
				finalPosts = [...finalPosts, ...posts];
			}
			finalPosts = finalPosts.sort(
				(objA, objB) => Number(objB.createdAt) - Number(objA.createdAt)
			);
			return finalPosts;
		} catch (error) {
			console.log(error);
		}
	}

	public async getUserPosts(userId: string) {
		const posts = await this.PostModel.find({ user: userId });
		return posts;
	}

	public async getPostById(postId: Types.ObjectId) {
		const post = await this.PostModel.findById(postId);
		return post;
	}

	public async likePost(postId: Types.ObjectId, userId: Types.ObjectId) {
		const likedPost = await this.PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $push: { likes: userId } },
			{ new: true }
		);
		return likedPost;
	}

	public async unlikePost(postId: Types.ObjectId, userId: Types.ObjectId) {
		const dislikedPost = await this.PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $pull: { likes: userId } },
			{ new: true }
		);
		return dislikedPost;
	}

	// Helper
	public async pushNewCommentIdToPost(
		postId: Types.ObjectId,
		commentId: Types.ObjectId
	) {
		const result = await this.PostModel.findOneAndUpdate(
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
		const result = await this.PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $pull: { comments: commentId } },
			{ new: true }
		);
		return result;
	}
}
