import * as Joi from "@hapi/joi";
import "joi-extract-type";

const FollowDtoSchema: any = Joi.object().keys({
  userId: Joi.string().required(),
  targetId: Joi.string().required(),
});

interface FollowDto {
  userId: string;
  targetId: string;
};

export {
  FollowDtoSchema,
  FollowDto,
};
