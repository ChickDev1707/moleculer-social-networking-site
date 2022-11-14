import { Context, Errors } from "moleculer";
import { IConversationDTO, IConversationOf2, IMemberDTO, IResConversation, IUserInfo } from "../dtos/conversation.dto";
import mongoose from "mongoose";
const { Types }  = mongoose;
import { ConversationRepository } from "../repository/conversation.repository";
import { IApiResponse } from "../../../../configs/api.type";

export default class ConversationAction {
  private conversationRepo = new ConversationRepository();

  public createConversation = async (ctx: Context<IConversationDTO>): Promise<IApiResponse> => {
    try {
      const newConversation = await this.conversationRepo.create(ctx.params);
      //Call user service to get user info
      var detailMembers:IUserInfo[];
      // detailMembers = await ctx.broker.call("");

      const resConversation: IResConversation = {
        _id: newConversation._id,
        members: newConversation.members,
        detailMembers: detailMembers,
        name: newConversation.name,
        avatar: newConversation.avatar,
        createdAt: newConversation.createdAt,
        updatedAt: newConversation.updatedAt,
        createdBy: newConversation.createdBy

      }

      return { code: 201, message: "Conversation was created", data: resConversation };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public getConversation = async (ctx: any): Promise<IApiResponse> => {
    try {
      const conversation = await this.conversationRepo.getById(ctx.params.id);

      if(conversation == null) 
        return {code: 404, message: "Conversation not found", data: null}
      //Call User service to get user info
      var detailMembers:IUserInfo[];
      // detailMembers = await ctx.broker.call("");
      const resConversation: IResConversation = {
        _id: conversation._id,
        members: conversation.members,
        detailMembers: detailMembers,
        name: conversation.name,
        avatar: conversation.avatar,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        createdBy: conversation.createdBy

      }
      return { code: 200, message: "", data: resConversation };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public getConversationOfTwoUser = async (ctx: Context<IConversationOf2>): Promise<IApiResponse> => {
    const conversation = await this.conversationRepo.getConversationOf2User(ctx.params);
    if(conversation == null) 
        return {code: 404, message: "Conversation not found", data: null}

         //Call User service to get user info
      var detailMembers:IUserInfo[];
      // detailMembers = await ctx.broker.call("");
      const resConversation: IResConversation = {
        _id: conversation._id,
        members: conversation.members,
        detailMembers: detailMembers,
        name: conversation.name,
        avatar: conversation.avatar,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        createdBy: conversation.createdBy

      }
      return { code: 200, message: "", data: resConversation };
  }

  public getConversationOfMine = async (ctx: any): Promise<IApiResponse> => {
    try {
      const conversations = await this.conversationRepo.getConversationOfUser(ctx.params.userId);
      let resConversations:IResConversation[] = [];   
      
      conversations.forEach(conversation => {
          //Call user service to get user info
          var detailMembers:IUserInfo[];
          // detailMembers = await ctx.broker.call("");
          const resConversation: IResConversation = {
              _id: conversation._id,
              members: conversation.members,
              detailMembers: detailMembers,
              name: conversation.name,
              avatar: conversation.avatar,
              createdAt: conversation.createdAt,
              updatedAt: conversation.updatedAt,
              createdBy: conversation.createdBy
  
          }
          resConversations.push(resConversation);
      });

      return { code: 200, message: "", data: conversations };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public addMember = async (ctx: Context<IMemberDTO>): Promise<IApiResponse> => {
    try {

      // const existingUsers = await this.broker.call(
      // 	"",
      // 	[{  }]
      // );

      // if (!existingUsers) {
      // 	return {
      // 		succeeded: false,
      // 		message: "",
      // 	};
      // }

      const conversation = await this.conversationRepo.getById(ctx.params.conversation)
      if(!conversation)
        return { code: 404, message: "Conversation does not exist!", data: null };

      if(conversation.members.indexOf(ctx.params.member) != -1)
        return { code: 400, message: "Member already exist!", data: null };

      const updatedConversation = await this.conversationRepo.addMember(ctx.params);

      //Call User service
      var detailMembers:IUserInfo[];
      // detailMembers = await ctx.broker.call("");

      const resConversation: IResConversation = {
        _id: conversation._id,
        members: conversation.members,
        detailMembers: detailMembers,
        name: conversation.name,
        avatar: conversation.avatar,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        createdBy: conversation.createdBy

      }

      return { code: 200, message: "Conversation updated", data: resConversation };

    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };

  public removeMember = async (ctx: Context<IMemberDTO>): Promise<IApiResponse> => {
    try {

      // const existingUsers = await this.broker.call(
      // 	"",
      // 	[{  }]
      // );

      // if (!existingUsers) {
      // 	return {
      // 		succeeded: false,
      // 		message: "",
      // 	};
      // }

      const updatedConversation = await this.conversationRepo.removeMember(ctx.params);

      //Call user service to get UserInfo
      var detailMembers:IUserInfo[];
      // detailMembers = await ctx.broker.call("");
          
      const resConversation: IResConversation = {
        _id: updatedConversation._id,
        members: updatedConversation.members,
        detailMembers: detailMembers,
        name: updatedConversation.name,
        avatar: updatedConversation.avatar,
        createdAt: updatedConversation.createdAt,
        updatedAt: updatedConversation.updatedAt,
        createdBy: updatedConversation.createdBy
      }
      return { code: 200, message: "", data: resConversation };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };


}
