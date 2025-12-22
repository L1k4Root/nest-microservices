import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Logger, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDTO, ChangeOrderStatusDto } from './dto';
import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('order')
export class OrderController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly orderClient: ClientProxy,

  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    const logger = new Logger('OrderController');
    logger.log(`Creating order with data: ${JSON.stringify(createOrderDto)}`);
    return this.orderClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDTO: OrderPaginationDTO) {
    return this.orderClient.send('findAllOrders', paginationDTO)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
    const order = await firstValueFrom(this.orderClient.send('findOneOrder', id));
    return order;
    } catch (error) {
      throw new RpcException(error);
    }
  
  }

  @Patch('change-status/:id')
  changeOrderStatus(@Param('id', ParseUUIDPipe) id: string, @Body() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.orderClient.send('changeOrderStatus', { id, status: changeOrderStatusDto.status }); 
  }
}
