import * as Joi from "@hapi/joi";
import "joi-extract-type";
import { FollowingAction } from "../enums/following-action.enum";

const FollowingDtoSchema: any = Joi.object().keys({
  userId: Joi.string().required(),
  targetId: Joi.string().required(),
  actionType: Joi.string().valid(Object.values(FollowingAction)).required(),
});

interface FollowingDto {
  userId: string;
  targetId: string;
  actionType: string;
};

export {
  FollowingDtoSchema,
  FollowingDto,
};
