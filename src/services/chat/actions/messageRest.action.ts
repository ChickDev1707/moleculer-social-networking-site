import { Context, Errors } from "moleculer";
import { IResConversation, IUserInfo } from "../dtos/conversation.dto";
import { MessageRepository } from "../repository/message.repository";
import { IDeleteMessageDTO, INewMessageDTO, IReactMessage, IResMessage, ISeenMessage, IUpdateMessageDTO } from "../dtos/message.dto";
import { ConversationRepository } from "../repository/conversation.repository";
import { IApiResponse } from "../../../../configs/api.type";

export default class MessageActionRest {

  private messageRepo = new MessageRepository();
  private conversationRepo = new ConversationRepository();

  public createMessage = async (ctx: Context<INewMessageDTO>): Promise<IApiResponse> => {
    try {
      const newMessage = await this.messageRepo.create(ctx.params);
      
      var senderDetail:IUserInfo;
      // senderInfo = await ctx.broker.call("");

      var conversationDetails:IResConversation;
      // conversationDetails = await ctx.broker.call("")
  
      const resMessage: IResMessage = {
        _id: newMessage._id,
        conversation: newMessage.conversation,
        conversationDetails: conversationDetails,
        sender: newMessage.sender,
        senderDetail: senderDetail,
        content: newMessage.content,
        seenBy: newMessage.seenBy,
        reactBy: newMessage.reactBy,
        seenByDetail: [],
        reactByDetail: [],
        updatedAt: newMessage.updatedAt,
        createdAt: newMessage.createdAt
      }

      return { code: 201, message: "message was created", data: resMessage };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public DeleteMessage = async (ctx: Context<IDeleteMessageDTO>): Promise<IApiResponse> => {
    try {
      const deletedMessage = await this.messageRepo.deleteMessage(ctx.params);
      return { code: 201, message: "Message was deleted", data: true };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public updateMessage = async (ctx: Context<IUpdateMessageDTO>): Promise<IApiResponse> => {
    try {
      console.log(ctx.params)
      const updatedMessage = await this.messageRepo.updateMessage(ctx.params);

      var senderDetail:IUserInfo;
      // senderInfo = await ctx.broker.call("");
  
      var conversationDetails:IResConversation;
      // conversationDetails = await ctx.broker.call("")
  
      const resMessage: IResMessage = {
        _id: updatedMessage._id,
        conversation: updatedMessage.conversation,
        conversationDetails: conversationDetails,
        sender: updatedMessage.sender,
        senderDetail: senderDetail,
        content: updatedMessage.content,
        seenBy: updatedMessage.seenBy,
        reactBy: updatedMessage.reactBy,
        seenByDetail: [],
        reactByDetail: [],
        updatedAt: updatedMessage.updatedAt,
        createdAt: updatedMessage.createdAt
      }

      return { code: 201, message: "Message was updated", data: resMessage };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public seenMessage = async (ctx: Context<ISeenMessage>): Promise<IApiResponse> => {
    try {
      const updatedMessage = await this.messageRepo.seenMessage(ctx.params);
      return { code: 201, message: "seen", data: true };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public reactMessage = async (ctx: Context<IReactMessage>): Promise<IApiResponse> => {
    try {
      const updatedMessage = await this.messageRepo.reactMessage(ctx.params);
      return { code: 201, message: "Conversation was created", data: true };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public getConversationMessages = async (ctx: any): Promise<IApiResponse> => {
    try {
      const messages = await this.messageRepo.getMessageOfConversation(ctx.params.conversationId);

      let resMessages =  messages.map( message=>{

        let senderDetail:IUserInfo;
        // senderInfo = await ctx.broker.call("");
  
        let seenByDetail:IUserInfo[] = message.seenBy.map(user=>{
          let userInfo:IUserInfo;
          // senderInfo = await ctx.broker.call("");
          return userInfo;
        });
  
        let reactByDetail:IUserInfo[] = message.reactBy.map(user=>{
          let userInfo:IUserInfo;
          // senderInfo = await ctx.broker.call("");
          return userInfo;
        });
    
        const resMessage: IResMessage = {
          _id: message._id,
          conversation: message.conversation,
          sender: message.sender,
          senderDetail: senderDetail,
          content: message.content,
          seenBy: message.seenBy,
          reactBy: message.reactBy,
          seenByDetail: seenByDetail,
          reactByDetail: reactByDetail,
          updatedAt: message.updatedAt,
          createdAt: message.createdAt
        }
        return resMessage;
      })

      return { code: 201, message: "", data: resMessages };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public deleteMessage = async (ctx:  Context<IDeleteMessageDTO>): Promise<IApiResponse> => {
    try {
      const messages = await this.messageRepo.deleteMessage(ctx.params);
      return { code: 201, message: "Message was deleted", data: messages };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

}
