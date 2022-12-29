import { Client } from "minio";
import { Context } from "moleculer";
import { IApiResponse } from "../../../../configs/api.type";
import { handleError } from "../../../utils/erros.util";

export default class MediaAction {

  // Instantiate the minio client with the endpoint
  private minioClient = new Client({
    endPoint: process.env.MEDIA_HOST,
    port: 9000,
    useSSL: false,
    accessKey: process.env.MEDIA_ACCESS_KEY,
    secretKey: process.env.MEDIA_SECRET_KEY,
  });

  public saveFile = async (ctx: any): Promise<IApiResponse> => {
    try {
      const imageName = `image-${Date.now()}`;
      await this.minioClient.putObject("images", imageName, ctx.params);
      const imageUrl = await this.minioClient.presignedGetObject("images", imageName);
      return {
        message: "Saved image",
        code: 200,
        data: imageUrl,
      };
    } catch (err) {
      handleError(err);
    }
  };
  public removeFiles = async (ctx: Context<{images: string[]}>): Promise<IApiResponse> => {
    try {
      const regex = /image-\d+/;
      const fileNames = ctx.params.images.map((image: string)=> regex.exec(image)[0]);
      await this.minioClient.removeObjects("images", fileNames);
      return {
        message: "Removed image",
        code: 200,
        data: null,
      };
    } catch (err) {
      handleError(err);
    }
  };

};
