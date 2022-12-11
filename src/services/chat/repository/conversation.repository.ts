import mongoose, { HydratedDocument, Types } from "mongoose";
import * as dotenv from "dotenv";
import { IConversationDTO, IConversationOf2, IMemberDTO } from "../dtos/conversation.dto";
import conversationModel from "../models/conversation.model";
dotenv.config();

export class ConversationRepository {
  public async create(conversation: IConversationDTO) {
    try {
      conversation.createdAt = new Date();
      conversation.updatedAt = new Date();
      const newConversation: HydratedDocument<IConversationDTO> = new conversationModel(conversation);
      await newConversation.save();
      return newConversation;
    } catch (error) {
      console.log("errorrrrrrrrr", error);
    }

  }

  public async getById(id: Types.ObjectId){
    const conversation = await conversationModel.findById(id);
    return conversation;
  }

  public async getConversationOf2User(params: IConversationOf2){
    const conversation = await conversationModel.findOne({
      members: { $all: [params.userId1, params.userId2] },
		});
    return conversation;
  }

  public async getConversationOfUser(userId: string){
    const conversations = await conversationModel.find({
			members: userId,
		});
    return conversations;
  }

  public async updateConversationName(data: {id: string; newName: string}){
    const conversation = await conversationModel.findByIdAndUpdate(data.id, {name: data.newName}, {new: true});
    return conversation;
  }

  public async updateConversationAvatar(data: {id: string; newAvatar: string}){
    const conversation = await conversationModel.findByIdAndUpdate(data.id, {avatar: data.newAvatar}, {new: true});
    return conversation;
  }

  public async addMember(newMemberData: IMemberDTO){
    const conversation = await conversationModel.findByIdAndUpdate(newMemberData.conversation, {$push: {members: newMemberData.member}}, {new: true});
    return conversation;
  }

  public async removeMember(memberData: IMemberDTO){
    const conversation = await conversationModel.findByIdAndUpdate(memberData.conversation, {$pull: {members: memberData.member}}, {new: true});
    return conversation;
  }
}
