import { HydratedDocument, Types } from "mongoose";
import {IDeleteMessageDTO, IMessageDTO, INewMessageDTO, IReactMessage, ISeenMessage, IUpdateMessageDTO } from "../dtos/message.dto";
import messageModel from "../models/message.model";

export class MessageRepository {
   public async create(conversation: INewMessageDTO) {
      const newMessage:HydratedDocument<IMessageDTO> = new messageModel(conversation);
      await newMessage.save();
      return newMessage;
  }

  public async getById(id: Types.ObjectId){
    const message = await messageModel.findById(id);
    return message;
  }

  public async getMessageOfConversation(conversationId: Types.ObjectId){
    const messages = await messageModel.find({conversation: conversationId, isDeleted: false});
    return messages;
  }

  public async updateMessage(updateData:IUpdateMessageDTO){
    try {
      const updatedMessage = await messageModel.findOneAndUpdate({_id: updateData.id, sender: updateData.sender}, {content: updateData.content}, {new: true});
      return updatedMessage;    
      
    } catch (error) {
      console.log("addddd");
      console.log(error)
    }
  }

  public async deleteMessage(deleteData: IDeleteMessageDTO){
    const conversation = await messageModel.findOneAndUpdate({sender: deleteData.sender, _id: deleteData.id}, {isDeleted: true}, {new: true});
    return conversation;    
  }

  public async seenMessage(seenData: ISeenMessage){
    const updatedMessage = await messageModel.findByIdAndUpdate(seenData.id, {$push: {seenBy: seenData.seenBy}}, {new: true});
    return updatedMessage;
  }

  public async reactMessage(reactData: IReactMessage){
    const updatedMessage = await messageModel.findByIdAndUpdate(reactData.id, {$push: {reactBy: reactData.reactBy}}, {new: true});
    return updatedMessage;
  }
}
