/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import { Context, Errors } from "moleculer";
import { IPostDTO } from "../dtos/post.dto";
import { PostRepository } from "../repository/post.repository";
import { IApiResponse } from "../../../../configs/api.type";
import { CreateUserDto } from "../../user/dtos/create-user.dto";

export default class PostAction {
	private postRepo = new PostRepository();

	// Main action
	public createPost = async (
		ctx: Context<IPostDTO>
	): Promise<IApiResponse> => {
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
			let updatedPost: any = null;
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
			const { postId } = ctx.params;
			const deletedPost = await this.postRepo.deletePost(postId);
			return {
				message: "Deleted post",
				code: 200,
				data: deletedPost,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};

	public getHomePosts = async (ctx: Context<{ userId: string }>): Promise<IApiResponse> => {
		try {
			// Call getUserById(ctx.params.userId) --> user
			const listFollowings: any = await ctx.broker.call(
				"users.getFollowings",
				{ userId: ctx.params.userId }
			);
			const posts = await this.postRepo.getFollowingsPosts(listFollowings.data);
			// Populate userInfo -->post
			const finalPosts: any = [];
			for (const post of posts) {
				const userInfo: IApiResponse = await ctx.broker.call("users.getUser", {
					userId: post.user,
				});
				const listUserInfoLikedPost: IApiResponse = await ctx.broker.call("posts.getListUserInfoLikedPost", { postId: post._id});
				const obj0 = {
					listUserInfoLikedPost: listUserInfoLikedPost.data,
				};
				const obj1 = post._doc;
				const obj2 = {
					userInfo: userInfo.data,
				};
				const finalPost = {...obj0, ...obj1, ...obj2 };
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

	public getUserPosts = async (
		ctx: Context<any>
	): Promise<IApiResponse> => {
		try {
			const { userId } = ctx.params;
			const posts: any = await this.postRepo.getUserPosts(userId); // Polupate với user
			const finalPosts: any = [];
			for (const post of posts) {
				const userInfo: any = await ctx.broker.call("users.getUser", { userId });
				const obj1 = post._doc;
				const obj2 = {
					userInfo: userInfo.data,
				};
				const finalPost = { ...obj1, ...obj2 };
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
			const post: any = await this.postRepo.getPostById(postId); // Polupate với user
			const userInfo: any = await ctx.broker.call("users.getUser", { userId: post.user });
			const obj1 = post._doc;
			const obj2 = {
				userInfo: userInfo.data,
			};
			const finalPost = { ...obj1, ...obj2 };
			return {
				message: "Successful request",
				code: 200,
				data: finalPost,
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

	// ????????????
	public getListUserInfoLikedPost = async (ctx: Context<any>): Promise<IApiResponse> => {
		try {
			const {postId} = ctx.params;
			const post: IPostDTO = await this.postRepo.getPostById(postId);
			const listUserInfo: CreateUserDto[] = [];
			for (const userId of post.likes) {
				const userInfo: IApiResponse = await ctx.broker.call("users.getUser", { userId });
				listUserInfo.push(userInfo.data);
			}
			return {
				message: "Get list-user-info-like-post successfully",
				code: 200,
				data: listUserInfo,
			};
		} catch (error) {
			throw new Errors.MoleculerError("Internal server error", 500);
		}
	};
}
