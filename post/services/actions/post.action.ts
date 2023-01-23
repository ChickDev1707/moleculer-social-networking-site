/* eslint-disable no-underscore-dangle */
import { Context, Errors } from "moleculer";
import { Connection, Types } from "mongoose";
import { IPost } from "../entities/post.entity";
import { PostRepository } from "../repository/post.repository";
import { IApiResponse } from "../types/api.type";
import { LikePostDto } from "../dtos/like-post.dto";
import { UpdatePostDto } from "../dtos/update-post.dto";

export default class PostAction {
	private postRepo: PostRepository;
	public constructor(connection: Connection) {
		this.postRepo = new PostRepository(connection);
	}

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

	public getUserPosts = async (ctx: Context<{ userId: string }>): Promise<IApiResponse> => {
		try {
			const posts: IPost[] = await this.postRepo.getUserPosts(ctx.params.userId);
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
			const post: IPost = await this.postRepo.getPostById(postId);
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

	public createPost = async (ctx: Context<IPost>): Promise<IApiResponse> => {
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

	public updatePost = async (ctx: Context<UpdatePostDto>): Promise<IApiResponse> => {
		try {
			const { postId, content, oldImages, images } = ctx.params;

			const deletedImages = oldImages.filter((image: string) => !images.includes(image));

			await ctx.broker.call("media.removeFiles", { images: deletedImages });

			const updatedPost = await this.postRepo.updatePost(postId, content, images);

			return {
				message: "Updated post",
				code: 200,
				data: updatedPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public deletePost = async (ctx: Context<{postId: Types.ObjectId}>): Promise<IApiResponse> => {
		try {
			const deletedPost = await this.postRepo.deletePost(
				ctx.params.postId
			);
			await ctx.broker.call("media.removeFiles", { images: deletedPost.images });
			return {
				message: "Deleted post",
				code: 200,
				data: deletedPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public likePost = async (ctx: Context<LikePostDto>): Promise<IApiResponse> => {
		try {
			const likedPost = await this.postRepo.likePost(ctx.params);
			return {
				message: "Liked post",
				code: 200,
				data: likedPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public dislikePost = async (ctx: Context<LikePostDto>): Promise<IApiResponse> => {
		try {
			const dislikedPost = await this.postRepo.dislikePost(ctx.params);
			return {
				message: "Disliked post",
				code: 200,
				data: dislikedPost,
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
		const userInfoResponse: IApiResponse = await ctx.broker.call("users.getUser", { userId: post.user });
		// Get list user liked this post
		const listUserLiked: any[] = [];
		for (const userId of post.likes) {
			const userLikedInfo: IApiResponse = await ctx.broker.call("users.getUser", { userId });
			listUserLiked.push(userLikedInfo.data);
		}
		// Return final post
		const finalPost = {
			...post._doc,
			...{ user: userInfoResponse.data },
			...{ likes: listUserLiked },
		};
		return finalPost;
	} catch (error) {
		throw new Errors.MoleculerError("Internal server error", 500);
	}
};
