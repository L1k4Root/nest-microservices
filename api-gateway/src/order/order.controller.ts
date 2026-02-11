import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Logger,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  CreateOrderDto,
  OrderPaginationDTO,
  ChangeOrderStatusDto,
} from './dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('order')
export class OrderController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    const logger = new Logger('OrderController');
    logger.log(`Creating order with data: ${JSON.stringify(createOrderDto)}`);
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(@Query() paginationDTO: OrderPaginationDTO) {
    try {
      console.log("Received pagination parameters:", paginationDTO);
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', paginationDTO),
      );
      console.log(orders);
      return orders;
    } catch (error) {
      console.log(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(this.client.send('findOneOrder', id));
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch('change-status/:id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return this.client.send('changeOrderStatus', {
      id,
      status: changeOrderStatusDto.status,
    });
  }
}
