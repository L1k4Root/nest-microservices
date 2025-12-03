import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDTO } from 'src/common';

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
    const product = await this.product.findUnique({
      where: {
        id: id,
        available: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: __, ...rest } = updateProductDto;

    return await this.product.update({
      where: {
        id: id,
      },
      data: rest,
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
