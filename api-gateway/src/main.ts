import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway for microservices architecture')
    .setVersion('1.0')
    .addTag('api-gateway')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);




  await app.listen(envConfig.PORT || 3000);
  logger.log(`Starting API Gateway service on port: ${envConfig.PORT || 3000}`);
}
bootstrap();