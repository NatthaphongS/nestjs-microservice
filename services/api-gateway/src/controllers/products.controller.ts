import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  @Get()
  async findAll() {
    return await firstValueFrom(
      this.productsClient.send({ cmd: 'get_all_products' }, {}),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await firstValueFrom(
      this.productsClient.send({ cmd: 'get_product' }, { id }),
    );
  }

  @Post()
  async create(@Body() createProductDto: { name: string; price: number; description?: string }) {
    return await firstValueFrom(
      this.productsClient.send({ cmd: 'create_product' }, createProductDto),
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: { name?: string; price?: number; description?: string },
  ) {
    return await firstValueFrom(
      this.productsClient.send({ cmd: 'update_product' }, { id, ...updateProductDto }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await firstValueFrom(
      this.productsClient.send({ cmd: 'delete_product' }, { id }),
    );
  }
}
