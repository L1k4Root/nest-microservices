import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';
import { PRODUCTS_SERVICE, envConfig } from 'src/config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ClientsModule.register([
      { name: PRODUCTS_SERVICE, 
        transport: Transport.TCP,
      options: {
        host: envConfig.PRODUCTS_MICROSERVICE_HOST,
        port: envConfig.PRODUCTS_MICROSERVICE_PORT,
      } },
    ]),
  ],

})
export class ProductsModule {}
