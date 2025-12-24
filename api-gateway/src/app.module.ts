import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
import { NatsModule } from './nats/nats.module';

@Module({
  imports: [ProductsModule, OrderModule, NatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
