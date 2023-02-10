import * as Joi from "@hapi/joi";
import "joi-extract-type";
import { Types } from "mongoose";

const UpdatePostDtoSchema: any = Joi.object().keys({
  postId: Joi.string().required(),
  content: Joi.string(),
  oldMedia: Joi.array(),
  newMedia: Joi.array(),
});

interface UpdatePostDto{
  postId: Types.ObjectId;
  content: string;
  oldMedia: string[];
  newMedia: string[];
}

export {
  UpdatePostDtoSchema,
  UpdatePostDto,
};
