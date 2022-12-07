import mongoose, {HydratedDocument, Types} from "mongoose";
import * as dotenv from "dotenv";
import { ICommentDTO } from "../dtos/comment.dto";
import commentModel from "../models/comment.model";

dotenv.config();

export class CommentRepository {
    public async createComment(comment: ICommentDTO){
        const newComment: HydratedDocument<ICommentDTO> = new commentModel(comment);
        await newComment.save();
        return newComment;
    }

    public async updateComment(commentId: Types.ObjectId, content: string){
        const modifiedAt = new Date((new Date()).getTime() + 24*60*60*1000);
        const updatedComment = await commentModel.findOneAndUpdate({_id: commentId}, {content, modifiedAt}, {new: true});
        return updatedComment;
    }

    public async deleteComment(commentId: Types.ObjectId){
        const deletedComment = await commentModel.findOneAndDelete({_id: commentId});
        return deletedComment;
    }

    public async getPostComments(postId: Types.ObjectId){
        const comments = await commentModel.find({postId, parent: "x"}).populate("reply");
        return comments;
    }

    public async likeComment(commentId: Types.ObjectId, userId: string){
        const likedComment = await commentModel.findOneAndUpdate({_id: commentId}, {$push: {likes: userId}}, {new: true});
        return likedComment;
    }

    public async unlikeComment(commentId: Types.ObjectId, userId: string){
        const unlikedComment = await commentModel.findOneAndUpdate({_id: commentId}, {$pull: {likes: userId}}, {new: true});
        return unlikedComment;
    }

    // Helper
    public async isLikedComment(commentId: Types.ObjectId, userId: string){
        const checkComment = await commentModel.find({_id: commentId, likes: userId});
        if(checkComment.length > 0) {return true;}
        return false;
    }

    public async pushNewCommentIdToParentComment(parentCommentId: Types.ObjectId, commentId: Types.ObjectId){
        const commentResult = await commentModel.findOneAndUpdate({_id: parentCommentId}, {$push: {reply: commentId}}, {new: true});
        return commentResult;
    }

}
