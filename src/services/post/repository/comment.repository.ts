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

    public async updateComment(id: Types.ObjectId, content: string){
        const modifiedAt = new Date((new Date()).getTime() + 24*60*60*1000);
        const updatedComment = await commentModel.findOneAndUpdate({_id: id}, {content, modifiedAt}, {new: true});
        return updatedComment;
    }

    public async deleteComment(id: Types.ObjectId){
        const deletedComment = await commentModel.findOneAndDelete({_id: id});
        return deletedComment;
    }

    public async getComment(postId: Types.ObjectId){
        const comments = await commentModel.find({postId, parent: "x"}).populate("reply");
        return comments;
    }

    public async likeComment(id: Types.ObjectId, userId: Types.ObjectId){
        const likedComment = await commentModel.findOneAndUpdate({_id: id}, {$push: {likes: userId}}, {new: true});
        return likedComment;
    }

    public async unlikeComment(id: Types.ObjectId, userId: Types.ObjectId){
        const unlikedComment = await commentModel.findOneAndUpdate({_id: id}, {$pull: {likes: userId}}, {new: true});
        return unlikedComment;
    }

    // Helper repo
    public async isCommented(id: Types.ObjectId, userId: Types.ObjectId){
        const checkComment = await commentModel.find({_id: id, likes: userId});
        if(checkComment.length > 0) {return true;}
        return false;
    }

    public async pushNewCommentIdToParentComment(parentCommentId: Types.ObjectId, newCommentId: Types.ObjectId){
        const commentResult = await commentModel.findOneAndUpdate({_id: parentCommentId}, {$push: {reply: newCommentId}}, {new: true});
        return commentResult;
    }

}
