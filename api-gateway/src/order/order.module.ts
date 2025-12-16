import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envConfig, ORDERS_SERVICE } from 'src/config';

@Module({
  controllers: [OrderController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_SERVICE,
        transport: Transport.TCP, // Transport.TCP
        options: {
          host: envConfig.ORDERS_MICROSERVICE_HOST,
          port: envConfig.ORDERS_MICROSERVICE_PORT,
        },
      }
    ])
  ],
})
export class OrderModule {}
