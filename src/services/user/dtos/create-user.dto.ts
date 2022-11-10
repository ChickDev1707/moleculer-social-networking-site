import * as Joi from "@hapi/joi";
import { Gender } from "../enums/gender.enum";
import "joi-extract-type";

const CreateUserDtoSchema: any = Joi.object().keys({
  name: Joi.string().required(),
  avatar: Joi.string().default(""),
  gender: Joi.string().valid(Object.values(Gender)).required(),
  dateOfBirth: Joi.date(),
  address: Joi.string().required(),
});

interface CreateUserDto{
  name: string;
  avatar: string;
  gender: Gender;
  dateOfBirth: Date;
  address: string;
}

export {
  CreateUserDtoSchema,
  CreateUserDto,
};
