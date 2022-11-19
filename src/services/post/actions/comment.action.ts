import mongoose from "mongoose";
const { Types }  = mongoose;
import { BrokerNode, Context, Errors, ServiceBroker  } from "moleculer";
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
                parent: ctx.params.parentCommentId ? ctx.params.parentCommentId : "x",
                likes: ctx.params.likes?ctx.params.likes: [],
                user: ctx.params.userId,
                postId: ctx.params.postId,
                postUserId: ctx.params.postUserId,
                createAt: new Date((new Date()).getTime() + 24*60*60*1000),
                modifiedAt: new Date((new Date()).getTime() + 24*60*60*1000),
            };
            const newComment = await this.commentRepo.createComment(commentTemp);
            // Push newCommentId to "comments" of post
            const postId = ctx.params.postId;
            const newCommentId = newComment.id;
            console.log("newCommentId: ", newCommentId);
            await ctx.broker.call("posts.pushNewCommentIdToPost", {id: postId, commentId: newCommentId});
            // If newComment have parentComment, push newCommentId to "reply" of parentComment
            if(ctx.params.parentCommentId){
                const parentCommentId = ctx.params.parentCommentId;
                await ctx.broker.call("comments.pushNewCommentIdToParentComment", {parentCommentId, newCommentId});
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
            console.log(ctx.params);
            if(!ctx.params.content){
                return {
                    message: "Content is require",
                    code: 400,
                };
            };
            const {id, content} = ctx.params;
            const updatedComment = await this.commentRepo.updateComment(id, content);
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
            const deletedComment = await this.commentRepo.deleteComment(ctx.params.id);
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
            const {id, userId} = ctx.params;
            const isCommented = await this.commentRepo.isCommented(id, userId);
            if(isCommented){
                const unlikedComment = await this.commentRepo.unlikeComment(id, userId);
                return {
                    message: "Unliked comment",
                    code: 200,
                    data: unlikedComment,
                };
            }else{
                const likedComment = await this.commentRepo.likeComment(id, userId);
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

    // Helper actions
    public pushNewCommentIdToParentComment = async (ctx: Context<any>): Promise<IApiResponse>=>{
        try {
            const {parentCommentId, newCommentId} = ctx.params;
            const result = await this.commentRepo.pushNewCommentIdToParentComment(parentCommentId, newCommentId);
            return {
                message: "Pushed New Comment Id To Parent Comment",
                code: 200,
                data: result,
            };
        } catch (error) {
            throw new Errors.MoleculerError("Internal server error", 500);
        }
    };

}
