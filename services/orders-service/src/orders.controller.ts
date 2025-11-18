import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'get_all_orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern({ cmd: 'get_order' })
  findOne(data: { id: string }) {
    return this.ordersService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'get_user_orders' })
  findUserOrders(data: { userId: string }) {
    return this.ordersService.findUserOrders(data.userId);
  }

  @MessagePattern({ cmd: 'create_order' })
  create(data: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    return this.ordersService.create(data);
  }

  @MessagePattern({ cmd: 'update_order_status' })
  updateStatus(data: { id: string; status: string }) {
    return this.ordersService.updateStatus(data.id, data.status);
  }

  @MessagePattern({ cmd: 'cancel_order' })
  cancel(data: { id: string }) {
    return this.ordersService.cancel(data.id);
  }
}
