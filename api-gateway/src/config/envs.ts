/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as joi from 'joi';
import 'dotenv/config';

interface EnvConfig {
  PORT: number;
}

const envSchema = joi
  .object<EnvConfig>({
    PORT: joi.number().default(3000),
  })
  .unknown(true); // Allow other variables

const { error, value } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvConfig = value;

export const envConfig: EnvConfig = {
  PORT: envVars.PORT,
};
