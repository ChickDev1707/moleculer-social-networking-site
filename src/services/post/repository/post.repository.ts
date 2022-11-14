import mongoose, {HydratedDocument, Types} from "mongoose";
import * as dotenv from "dotenv";
import { IPostDTO } from "../dtos/post.dto";
import postModel from "../models/post.model";

dotenv.config();

export class PostRepository {
    public async createPost(post: IPostDTO){
        const newPost: HydratedDocument<IPostDTO> = new postModel(post);
        await newPost.save();
        return newPost;
    }

    public async updatePost(id: Types.ObjectId, content: string, images: string[]){
        const updatedPost = await postModel.findOneAndUpdate({_id: id}, {content, images}, {new: true});
        return updatedPost;
    }

    public async deletePost(id: Types.ObjectId){
        const deletedPost = await postModel.findByIdAndDelete(id);
        return deletedPost;
    }

    public async getPosts(){
        const posts = await postModel.find();
        return posts;
    }

    public async getPostByUserId(userId: Types.ObjectId){
        const posts = await postModel.find({user: userId});
        return posts;
    }

    public async getPostById(id: Types.ObjectId){
        const post = await postModel.findById(id);
        return post;
    }

    public async likePost(id: Types.ObjectId, userId: Types.ObjectId){
        const likedPost = await postModel.findOneAndUpdate({_id: id},{$push: {likes: userId}}, {new: true});
        return likedPost;
    }

    public async unlikePost(id: Types.ObjectId, userId: Types.ObjectId){
        const unlikedPost = await postModel.findOneAndUpdate({_id: id}, {$pull: {likes: userId}}, {new: true});
        return unlikedPost;
    }
}
