import { Client } from "minio";
import { Context, Errors } from "moleculer";
import { Readable } from "stream";
import { IApiResponse } from "../types/api.type";
import { handleError } from "../utils/error.util";

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
      const [type, extension] = ctx.meta.mimetype.split('/');
      if (this.isSupportedMimetype(type)) {
        const fileUrl = await this.saveFileToMinio(ctx.params, { type, extension })
        return {
          message: "Saved file",
          code: 200,
          data: fileUrl,
        };
      } else {
        throw new Errors.MoleculerClientError("Unsupported media type", 415)
      }
    } catch (err) {
      handleError(err);
    }
  };

  private async saveFileToMinio(file: Readable, meta: any) {
    const fileName: string = `${meta.type}-${Date.now()}.${meta.extension}`;
    await this.minioClient.putObject('store', fileName, file);
    const fileUrl = await this.minioClient.presignedGetObject('store', fileName);
    return fileUrl
  }

  private isSupportedMimetype(mimetype: string) {
    return mimetype === 'video' || mimetype === 'image'
  }

  public removeMedia = async (ctx: Context<{ media: string[] }>): Promise<IApiResponse> => {
    try {
      console.log(ctx.params.media)
      const fileNames = this.getMediaFilenames(ctx.params.media);
      await this.minioClient.removeObjects("store", fileNames);
      return {
        message: "Removed media",
        code: 200,
        data: null,
      };
    } catch (err) {
      handleError(err);
    }
  };
  private getMediaFilenames = (media: string[]): string[] => {
    try {
      const regex = /(\w+)-(.*)\.(\w+)/; // format: name-date.extension
      const fileNames = media.map((url: string) => regex.exec(url)[0]);
      return fileNames;
    } catch {
      // Fail parsing image - images might not exist in storage
      // Use for url image
      return []
    }
  }
};
