
import * as Joi from "@hapi/joi";
import { Gender } from "../enums/gender.enum";
import "joi-extract-type";

const RegisterDtoSchema: any = Joi.object().keys({
  // Joi validation to check if username is email or vietnamese mobile number
  username: Joi.alternatives().try(
    Joi.string().email(),
    Joi.string().regex(/^(84|0[3|5|7|8|9])+([0-9]{8})$/)
  )
    .required()
    .error(() => "Invalid username type"),
  name: Joi.string().required(),
  gender: Joi.string().valid(Object.values(Gender)).required(),
  dateOfBirth: Joi.date().required(),
  password: Joi.string().required(),
});

interface RegisterDto {
  // Username could be email or phone number
  username: string;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  password: string;
}

export {
  RegisterDtoSchema,
  RegisterDto,
};
