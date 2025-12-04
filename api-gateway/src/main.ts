import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config';
import { Logger } from '@nestjs/common';


async function bootstrap() {

  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  // app.useGlobalPipes({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  // })
  await app.listen(envConfig.PORT || 3000);
  logger.log(`Starting API Gateway service on port: ${envConfig.PORT || 3000}`);
}
bootstrap();
