import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDTO } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { page = 1, limit = 10 } = paginationDTO;
    
    const totalItems = await this.product.count({
      where: { available: true },
    });
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      throw new NotFoundException('Page not found');
    }

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    await Logger.log(`Finding product with id: ${id}`);
    const product = await this.product.findFirst({
      where: {
        id: id,
        available: true,
      },
    });
    if (!product) throw new RpcException({
      message: 'Product not found',
      code: HttpStatus.NOT_FOUND,});
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;


    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: data,
    });


  }

  async remove(id: number) {
    await this.findOne(id);
    // Hard Delete
    // return this.product.delete({
    //   where: {
    //     id: id,
    //   },
    // });

    // Soft Delete
    return await this.product.update({
      where: { id: id },
      data: { available: false },
    });
  }
}
