import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'get_all_products' })
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern({ cmd: 'get_product' })
  findOne(data: { id: string }) {
    return this.productsService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'create_product' })
  create(data: { name: string; price: number; description?: string }) {
    return this.productsService.create(data);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(data: { id: string; name?: string; price?: number; description?: string }) {
    return this.productsService.update(data.id, data);
  }

  @MessagePattern({ cmd: 'delete_product' })
  remove(data: { id: string }) {
    return this.productsService.remove(data.id);
  }
}
