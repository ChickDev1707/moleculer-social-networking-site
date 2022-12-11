/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import { Context, Errors } from "moleculer";
import { IPostDTO } from "../dtos/post.dto";
import { PostRepository } from "../repository/post.repository";
import { IApiResponse } from "../../../../configs/api.type";
import { CreateUserDto } from "../../user/dtos/create-user.dto";

export default class PostAction {
	private postRepo = new PostRepository();

	public getHomePosts = async (ctx: Context<{ userId: string }>): Promise<IApiResponse> => {
		try {
			// Call User service to get list following user
			const listFollowings: IApiResponse = await ctx.broker.call("users.getFollowings", { userId: ctx.params.userId });
			const posts = await this.postRepo.getFollowingsPosts(listFollowings.data);
			const finalPosts = [];
			for (const post of posts) {
				const finalPost = await getFullDetailPost(ctx, post);
				finalPosts.push(finalPost);
			}
			return {
				message: "Successful request",
				code: 200,
				data: finalPosts,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public getUserPosts = async (ctx: Context<{userId: string}>): Promise<IApiResponse> => {
		try {
			const posts: IPostDTO[] = await this.postRepo.getUserPosts(ctx.params.userId);
			const finalPosts = [];
			for (const post of posts) {
				const finalPost = await getFullDetailPost(ctx, post);
				finalPosts.push(finalPost);
			}
			return {
				message: "Successful request",
				code: 200,
				data: finalPosts,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public getPostById = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const { postId } = ctx.params;
			const post: IPostDTO = await this.postRepo.getPostById(postId);
			const finalPost = await getFullDetailPost(ctx, post);
			return {
				message: "Successful request",
				code: 200,
				data: finalPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public createPost = async (ctx: Context<IPostDTO>): Promise<IApiResponse> => {
		try {
			const newPost = await this.postRepo.createPost(ctx.params);
			return {
				message: "Created post",
				code: 200,
				data: newPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public updatePost = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const { postId, content, images } = ctx.params;
			let updatedPost = {} as IPostDTO;
			if (images) {
				const imagesArray = images.split(",");
				updatedPost = await this.postRepo.updatePost(
					postId,
					content,
					imagesArray
				);
			} else {
				updatedPost = await this.postRepo.updatePost(postId, content);
			}
			return {
				message: "Updated post",
				code: 200,
				data: updatedPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public deletePost = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const deletedPost = await this.postRepo.deletePost(
				ctx.params.postId
			);
			return {
				message: "Deleted post",
				code: 200,
				data: deletedPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public likePost = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const { postId, userId } = ctx.params;
			const likedPost = await this.postRepo.likePost(postId, userId);
			return {
				message: "Liked post",
				code: 200,
				data: likedPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public unlikePost = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const { postId, userId } = ctx.params;
			const unlikedPost = await this.postRepo.unlikePost(postId, userId);
			return {
				message: "Unliked post",
				code: 200,
				data: unlikedPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};
}

// Sub function
export const getFullDetailPost = async (ctx: any, post: any) => {
	try {
		// Get user info
		const userInfoResponse: IApiResponse = await ctx.broker.call("users.getUser", {userId: post.user});
		// Get list user liked this post
		const listUserLiked: any[] = [];
		for (const userId of post.likes) {
			const userLikedInfo: IApiResponse = await ctx.broker.call("users.getUser", { userId });
			listUserLiked.push(userLikedInfo.data);
		}
		// Return final post
		const finalPost = {
			...post._doc,
			...{user: userInfoResponse.data},
			...{likes: listUserLiked}};
		return finalPost;
	} catch (error) {
		throw new Errors.MoleculerError("Internal server error", 500);
	}
};
