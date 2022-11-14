import { IConversationDTO, IConversationOf2, IMemberDTO } from "../dtos/conversation.dto";
import mongoose, { HydratedDocument, Types } from "mongoose";
import conversationModel from "../models/conversation.model";
import * as dotenv from "dotenv";
dotenv.config();

export class ConversationRepository {
  public async create(conversation: IConversationDTO) {
    const newConversation:HydratedDocument<IConversationDTO> = new conversationModel(conversation);
    await newConversation.save()
    return newConversation;
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

  public async getConversationOfUser(userId: Types.ObjectId){
    const conversations = await conversationModel.find({
			members: userId,
		});
    return conversations;
  }

  public async addMember(newMemberData:IMemberDTO){
    const conversation = await conversationModel.findByIdAndUpdate(newMemberData.conversation, {$push: {members: newMemberData.member}}, {new: true});
    return conversation;    
  }

  public async removeMember(memberData:IMemberDTO){
    const conversation = await conversationModel.findByIdAndUpdate(memberData.conversation, {$pull: {members: memberData.member}}, {new: true});
    return conversation;    
  }
}
