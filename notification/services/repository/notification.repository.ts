import { Connection, HydratedDocument, Model } from "mongoose";
import * as dotenv from "dotenv";
import { INotificationDTO } from "../dtos/notification.dto";
import NotificationSchema from "../models/notification.schema";
dotenv.config();

export class NotificationRepository {
  private NotificationModel: Model<INotificationDTO>;
  public constructor(connection: Connection){
    this.NotificationModel = connection.model("notification", NotificationSchema);
  }
  public async create(notification: INotificationDTO) {
    try {
      const newNotification: HydratedDocument<INotificationDTO> = new this.NotificationModel(notification);
      await newNotification.save();
      return newNotification;
    } catch (error) {
      console.log("error", error);
    }

  }

  public async getById(id: string){
    const conversation = await this.NotificationModel.findById(id);
    return conversation;
  }

  public async updateNotification(id: string, data: INotificationDTO){
    const updatedNotification = await this.NotificationModel.findByIdAndUpdate(id, data, {new: true});
    return updatedNotification;
  }

  public async getNotificationOfUser(userId: string, pageIndex: number, pageSize: number){
    const conversations = await this.NotificationModel.find({
			to: userId,
		})
    .sort({createdAt: "desc"})
    .skip((pageIndex - 1) * pageSize)
    .limit(pageSize);
    return conversations;
  }

  public async markAsReadNotificationOfUser(userId: string){
    const result =  await this.NotificationModel.updateMany({to: userId}, {read: true});
    return result;
  }

  public async delete(id: string){
    const deleted = await this.NotificationModel.deleteOne({_id: id});
    return deleted;
  }
}
