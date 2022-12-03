/* eslint-disable capitalized-comments */
import mongoose from "mongoose";
const { Types }  = mongoose;
import { BrokerNode, Context, Errors, ServiceBroker  } from "moleculer";
import { ICommentDTO } from "../dtos/comment.dto";
import { CommentRepository } from "../repository/comment.repository";
import { PostRepository } from "../repository/post.repository";
import { IApiResponse } from "../../../../configs/api.type";

export default class CommentAction{
    private commentRepo = new CommentRepository();
    private postRepo = new PostRepository();

    public getcomments = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {postId} = ctx.params;
            const comments = await this.commentRepo.getComments(postId); // Chưa polupate với user
            return {
                message: "Successful request",
                code: 200,
                data: comments,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    public createComment = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            if(!ctx.params.content){
                return {
                    message: "Content is require",
                    code: 400,
                };
            };
            const commentTemp: ICommentDTO = {
                content: ctx.params.content,
                tag: ctx.params.tag ? ctx.params.tag : [],
                reply: ctx.params.reply ? ctx.params.reply : [],
                parent: ctx.params.parentCommentId ? ctx.params.parentCommentId : "x",
                likes: ctx.params.likes?ctx.params.likes: [],
                user: ctx.params.userId,
                postId: ctx.params.postId,
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
            if(ctx.params.parentCommentId){
                const parentCommentId = ctx.params.parentCommentId;
                await this.commentRepo.pushNewCommentIdToParentComment(parentCommentId, commentId);
            };
            return {
                message: "Successful request",
                code: 200,
                data: newComment,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    public updateComment = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            if(!ctx.params.content){
                return {
                    message: "Content is require",
                    code: 400,
                };
            };
            const {commentId, content} = ctx.params;
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

    public deleteComment = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const deletedComment = await this.commentRepo.deleteComment(ctx.params.commentId);
            // Delete commentId in post-->comments
            const postId = ctx.params.postId;
            const commentId = deletedComment.id;
            await this.postRepo.pullDeletedCommentIdInPost(postId, commentId);
            // Return new list comment
            const newListComment = await this.commentRepo.getComments(postId);
            return {
                message: "Deleted comment",
                code: 200,
                data: newListComment,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    public reactComment = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {commentId, userId} = ctx.params;
            const isLikedComment = await this.commentRepo.isLikedComment(commentId, userId);
            if(isLikedComment){
                const unlikedComment = await this.commentRepo.unlikeComment(commentId, userId);
                return {
                    message: "Unliked comment",
                    code: 200,
                    data: unlikedComment,
                };
            }else{
                const likedComment = await this.commentRepo.likeComment(commentId, userId);
                return {
                    message: "Liked comment",
                    code: 200,
                    data: likedComment,
                };
            }
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };
}
