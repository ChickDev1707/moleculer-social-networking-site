import mongoose, { Connection, HydratedDocument, Model, Types } from "mongoose";
import * as dotenv from "dotenv";
import { IConversationDTO, IConversationOf2, IMemberDTO } from "../dtos/conversation.dto";
import ConversationSchema from "../models/conversation.schema";
dotenv.config();

export class ConversationRepository {
  private ConversationModel: any;
  public constructor(connection: Connection){
    this.ConversationModel = connection.model("conversations", ConversationSchema);
  }
  public async create(conversation: IConversationDTO) {
    try {
      conversation.createdAt = new Date();
      conversation.updatedAt = new Date();
      const newConversation: HydratedDocument<IConversationDTO> = new this.ConversationModel(conversation);
      await newConversation.save();
      return newConversation;
    } catch (error) {
      console.log("error", error);
    }

  }

  public async getById(id: Types.ObjectId){
    const conversation = await this.ConversationModel.findById(id);
    return conversation;
  }

  public async getConversationOf2User(params: IConversationOf2){
    const conversation = await this.ConversationModel.findOne({
      members: { $all: [params.userId1, params.userId2] },
		});
    return conversation;
  }

  public async getConversationOfUser(userId: string){
    const conversations = await this.ConversationModel.find({
			members: userId,
		});
    return conversations;
  }

  public async updateConversationName(data: {id: string; newName: string}){
    const conversation = await this.ConversationModel.findByIdAndUpdate(data.id, {name: data.newName}, {new: true});
    return conversation;
  }

  public async updateConversationAvatar(data: {id: string; newAvatar: string}){
    const conversation = await this.ConversationModel.findByIdAndUpdate(data.id, {avatar: data.newAvatar}, {new: true});
    return conversation;
  }

  public async addMember(newMemberData: IMemberDTO){
    const conversation = await this.ConversationModel.findByIdAndUpdate(newMemberData.conversation, {$push: {members: newMemberData.member}}, {new: true});
    return conversation;
  }

  public async removeMember(memberData: IMemberDTO){
    const conversation = await this.ConversationModel.findByIdAndUpdate(memberData.conversation, {$pull: {members: memberData.member}}, {new: true});
    return conversation;
  }
}
