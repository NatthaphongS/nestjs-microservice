import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @GrpcMethod('OrdersService', 'GetAllOrders')
  findAll() {
    return this.ordersService.findAll();
  }

  @GrpcMethod('OrdersService', 'GetOrder')
  findOne(data: { id: string }) {
    return this.ordersService.findOne(data.id);
  }

  @GrpcMethod('OrdersService', 'GetUserOrders')
  findUserOrders(data: { userId: string }) {
    return this.ordersService.findUserOrders(data.userId);
  }

  @GrpcMethod('OrdersService', 'CreateOrder')
  create(data: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    return this.ordersService.create(data);
  }

  @GrpcMethod('OrdersService', 'UpdateOrderStatus')
  updateStatus(data: { id: string; status: string }) {
    return this.ordersService.updateStatus(data.id, data.status);
  }

  @GrpcMethod('OrdersService', 'CancelOrder')
  cancel(data: { id: string }) {
    return this.ordersService.cancel(data.id);
  }
}
