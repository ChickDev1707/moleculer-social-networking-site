import mongoose from "mongoose";
const { Types }  = mongoose;
import { Context, Errors } from "moleculer";
import { ICommentDTO } from "../dtos/comment.dto";
import { CommentRepository } from "../repository/comment.repository";
import { IApiResponse } from "../../../../configs/api.type";

export default class CommentAction{
    private commentRepo = new CommentRepository();

    public getcomments = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {postId} = ctx.params;
            const comments = await this.commentRepo.getComment(postId);
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
                parent: ctx.params.commentId ? ctx.params.commentId : "x",
                likes: ctx.params.likes?ctx.params.likes: [],
                user: ctx.params.userId,
                postId: ctx.params.postId,
                postUserId: ctx.params.postUserId,
                createAt: new Date((new Date()).getTime() + 24*60*60*1000),
                modifiedAt: new Date((new Date()).getTime() + 24*60*60*1000),
            };
            const newComment = await this.commentRepo.createComment(commentTemp);
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
            console.log(ctx.params);
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
            const {commentId} = ctx.params;
            const deletedComment = await this.commentRepo.deleteComment(commentId);
            return {
                message: "Deleted comment",
                code: 200,
                data: deletedComment,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

    public reactComment = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {commentId, userId} = ctx.params;
            const isCommented = await this.commentRepo.isCommented(commentId, userId);
            if(isCommented){
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
