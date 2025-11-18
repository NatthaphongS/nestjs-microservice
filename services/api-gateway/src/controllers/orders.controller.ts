import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  @Get()
  async findAll() {
    return await firstValueFrom(
      this.ordersClient.send({ cmd: 'get_all_orders' }, {}),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await firstValueFrom(
      this.ordersClient.send({ cmd: 'get_order' }, { id }),
    );
  }

  @Get('user/:userId')
  async findUserOrders(@Param('userId') userId: string) {
    return await firstValueFrom(
      this.ordersClient.send({ cmd: 'get_user_orders' }, { userId }),
    );
  }

  @Post()
  async create(
    @Body()
    createOrderDto: {
      userId: string;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    return await firstValueFrom(
      this.ordersClient.send({ cmd: 'create_order' }, createOrderDto),
    );
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { status: string },
  ) {
    return await firstValueFrom(
      this.ordersClient.send(
        { cmd: 'update_order_status' },
        { id, status: updateStatusDto.status },
      ),
    );
  }

  @Delete(':id')
  async cancel(@Param('id') id: string) {
    return await firstValueFrom(
      this.ordersClient.send({ cmd: 'cancel_order' }, { id }),
    );
  }
}
