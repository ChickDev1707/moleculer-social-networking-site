import * as Joi from "@hapi/joi";
import "joi-extract-type";
import { Types } from "mongoose";

const UpdatePostDtoSchema: any = Joi.object().keys({
  postId: Joi.string().required(),
  content: Joi.string(),
  oldImages: Joi.array(),
  images: Joi.array(),
});

interface UpdatePostDto{
  postId: Types.ObjectId;
  content: string;
  oldImages: string[];
  images: string[];
}

export {
  UpdatePostDtoSchema,
  UpdatePostDto,
};
