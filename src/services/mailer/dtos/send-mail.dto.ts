import * as Joi from "@hapi/joi";
import "joi-extract-type";

const SendMailDtoSchema: any = Joi.object().keys({
  receiver: Joi.string().required(),
  subject: Joi.string().required(),
  content: Joi.string().required(),
});

interface SendMailDto{
  receiver: string;
  subject: string;
  content: string;
}

export {
  SendMailDtoSchema,
  SendMailDto,
};
