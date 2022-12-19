import * as Joi from "@hapi/joi";
import "joi-extract-type";

const LikePostDtoSchema: any = Joi.object().keys({
  postId: Joi.string().required(),
  userId: Joi.string().required(),
});

interface LikePostDto{
  postId: string;
  userId: string;
}

export {
  LikePostDtoSchema,
  LikePostDto,
};
