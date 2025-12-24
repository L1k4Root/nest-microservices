import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Logger, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDTO, ChangeOrderStatusDto } from './dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('order')
export class OrderController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,

  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    const logger = new Logger('OrderController');
    logger.log(`Creating order with data: ${JSON.stringify(createOrderDto)}`);
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDTO: OrderPaginationDTO) {
    return this.client.send('findAllOrders', paginationDTO)
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
  changeOrderStatus(@Param('id', ParseUUIDPipe) id: string, @Body() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.client.send('changeOrderStatus', { id, status: changeOrderStatusDto.status }); 
  }
}
