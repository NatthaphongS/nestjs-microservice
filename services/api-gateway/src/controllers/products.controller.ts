import { Controller, Get, Post, Put, Delete, Body, Param, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface ProductsService {
  getAllProducts(data: {}): Observable<any>;
  getProduct(data: { id: string }): Observable<any>;
  createProduct(data: { name: string; price: number; description?: string }): Observable<any>;
  updateProduct(data: { id: string; name?: string; price?: number; description?: string }): Observable<any>;
  deleteProduct(data: { id: string }): Observable<any>;
}

@Controller('products')
export class ProductsController implements OnModuleInit {
  private productsService: ProductsService;

  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productsService = this.client.getService<ProductsService>('ProductsService');
  }

  @Get()
  async findAll() {
    return this.productsService.getAllProducts({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.getProduct({ id });
  }

  @Post()
  async create(@Body() createProductDto: { name: string; price: number; description?: string }) {
    return this.productsService.createProduct(createProductDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: { name?: string; price?: number; description?: string },
  ) {
    return this.productsService.updateProduct({ id, ...updateProductDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.deleteProduct({ id });
  }
}
