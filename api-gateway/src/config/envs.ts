/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as joi from 'joi';
import 'dotenv/config';

interface EnvConfig {
  PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
}

const envSchema = joi
  .object<EnvConfig>({
    PORT: joi.number().default(3000),
    PRODUCTS_MICROSERVICE_HOST: joi.string().required().default('localhost'),
    PRODUCTS_MICROSERVICE_PORT: joi.number().required().default(3001),
  })
  .unknown(true); // Allow other variables

const { error, value } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvConfig = value;

export const envConfig: EnvConfig = {
  PORT: envVars.PORT,
  PRODUCTS_MICROSERVICE_HOST: envVars.PRODUCTS_MICROSERVICE_HOST,
  PRODUCTS_MICROSERVICE_PORT: envVars.PRODUCTS_MICROSERVICE_PORT,



};
