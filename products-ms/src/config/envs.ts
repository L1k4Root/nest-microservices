/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as joi from 'joi';
import 'dotenv/config';

interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
}

const envSchema = joi
  .object<EnvConfig>({
    PORT: joi.number().default(3000),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true); // Allow other variables

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvConfig = value;

export const envConfig: EnvConfig = {
  PORT: envVars.PORT,
  DATABASE_URL: envVars.DATABASE_URL,
};
