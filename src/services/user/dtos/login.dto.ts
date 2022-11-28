
import * as Joi from "@hapi/joi";
import "joi-extract-type";

const LoginDtoSchema: any = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().min(4).required(),
});

interface LoginDto{
  username: string;
  password: string;
}

export {
  LoginDtoSchema,
  LoginDto,
};
