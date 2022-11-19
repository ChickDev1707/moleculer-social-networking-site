import mongoose from "mongoose";
const { Types }  = mongoose;
import { Context, Errors } from "moleculer";
import { IPostDTO } from "../dtos/post.dto";
import { PostRepository } from "../repository/post.repository";
import { IApiResponse } from "../../../../configs/api.type";

export default class PostAction{
    private postRepo = new PostRepository();

    // Main action
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

    public updatePost = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {id, content, images}= ctx.params;
            let updatedPost: any = null;
            if(images){
                const imagesArray = images.split(",");
                updatedPost = await this.postRepo.updatePost(id, content, imagesArray);
            }else{
                updatedPost = await this.postRepo.updatePost(id, content);
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

    public deletePost = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {id} = ctx.params;
            const deletedPost = await this.postRepo.deletePost(id);
            return {
                message: "Deleted post",
                code: 200,
                data: deletedPost,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    public getPosts = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const posts = await this.postRepo.getPosts();
            return {
                message: "Successful request",
                code: 200,
                data: posts,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    public getPostsByUserId = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {id} = ctx.params;
            const posts = await this.postRepo.getPostByUserId(id);
            return {
                message: "Successful request",
                code: 200,
                data: posts,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    public getPostsById = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {id} = ctx.params;
            const post = await this.postRepo.getPostById(id);
            console.log(post);
            return {
                message: "Successful request",
                code: 200,
                data: post,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    public likePost = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {id, userId} = ctx.params;
            const likedPost = await this.postRepo.likePost(id, userId);
            return {
                message: "Liked post",
                code: 200,
                data: likedPost,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    public unlikePost = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {id, userId} = ctx.params;
            const unlikedPost = await this.postRepo.unlikePost(id, userId);
            return {
                message: "Unliked post",
                code: 200,
                data: unlikedPost,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    // Helper action
    public pushNewCommentIdToPost = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {id, commentId} = ctx.params;
            const result = await this.postRepo.pushNewCommentIdToPost(id, commentId);
            return {
                message: "Push new comment to post",
                code: 200,
                data: result,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };
}
