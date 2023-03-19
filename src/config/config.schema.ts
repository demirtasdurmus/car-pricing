import * as Joi from 'joi';
import { IConfig } from './config.interface';

export const configValidationSchema = Joi.object<IConfig>({
  APP_PORT: Joi.number().required(),
  DB_TYPE: Joi.alt(['postgres', 'sqlite']).required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_SYNC: Joi.boolean().required(),
  COOKIE_KEY: Joi.string().required(),
});
