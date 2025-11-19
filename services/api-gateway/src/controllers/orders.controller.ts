import { Controller, Get, Post, Put, Delete, Body, Param, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface OrdersService {
  getAllOrders(data: {}): Observable<any>;
  getOrder(data: { id: string }): Observable<any>;
  getUserOrders(data: { userId: string }): Observable<any>;
  createOrder(data: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
  }): Observable<any>;
  updateOrderStatus(data: { id: string; status: string }): Observable<any>;
  cancelOrder(data: { id: string }): Observable<any>;
}

@Controller('orders')
export class OrdersController implements OnModuleInit {
  private ordersService: OrdersService;

  constructor(
    @Inject('ORDERS_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.ordersService = this.client.getService<OrdersService>('OrdersService');
  }

  @Get()
  async findAll() {
    return this.ordersService.getAllOrders({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.getOrder({ id });
  }

  @Get('user/:userId')
  async findUserOrders(@Param('userId') userId: string) {
    return this.ordersService.getUserOrders({ userId });
  }

  @Post()
  async create(
    @Body()
    createOrderDto: {
      userId: string;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { status: string },
  ) {
    return this.ordersService.updateOrderStatus({ id, status: updateStatusDto.status });
  }

  @Delete(':id')
  async cancel(@Param('id') id: string) {
    return this.ordersService.cancelOrder({ id });
  }
}
