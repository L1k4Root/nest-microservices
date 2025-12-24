import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envConfig, NATS_SERVICE } from 'src/config';

@Module({
  controllers: [OrderController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS, // Transport.TCP
        options: {
          servers: envConfig.NATS_SERVERS,
          // host: envConfig.ORDERS_MICROSERVICE_HOST,
          // port: envConfig.ORDERS_MICROSERVICE_PORT,
        },
      }
    ])
  ],
})
export class OrderModule {}
