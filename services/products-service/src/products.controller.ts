import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @GrpcMethod('ProductsService', 'GetAllProducts')
  findAll() {
    return this.productsService.findAll();
  }

  @GrpcMethod('ProductsService', 'GetProduct')
  findOne(data: { id: string }) {
    return this.productsService.findOne(data.id);
  }

  @GrpcMethod('ProductsService', 'CreateProduct')
  create(data: { name: string; price: number; description?: string }) {
    return this.productsService.create(data);
  }

  @GrpcMethod('ProductsService', 'UpdateProduct')
  update(data: { id: string; name?: string; price?: number; description?: string }) {
    return this.productsService.update(data.id, data);
  }

  @GrpcMethod('ProductsService', 'DeleteProduct')
  remove(data: { id: string }) {
    return this.productsService.remove(data.id);
  }
}
