import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDTO } from 'src/common';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'createProduct' }, createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.client.send({ cmd: 'getProducts' }, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // OTHER WAY TO HANDLE ERRORS FROM MICROSERVICE  
    // 
    // return this.productsClient.send({ cmd: 'getProduct' }, id)
    // .pipe(
    //   catchError( err => { throw new RpcException(err.message); } )
    // );

    try {
      const producto = await firstValueFrom(this.client.send({ cmd: 'getProduct' }, id));
      return producto;
      // return this.productsService.findOne(+id);
      
    } catch (error) {
      // console.log('ERROR ENCONTRED WHILE FETCHING PRODUCT BY ID:', error);
      throw new RpcException(error);
  }
}

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    console.log('Update Product DTO:', updateProductDto);
    return this.client
      .send(
        { cmd: 'updateProduct' },
        {
          id,
          ...updateProductDto,
        },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send({ cmd: 'removeProduct' }, id);
  }
}
