import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: orders,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch orders',
        error: error.message,
      };
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!order) {
        return {
          success: false,
          message: 'Order not found',
        };
      }

      return {
        success: true,
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch order',
        error: error.message,
      };
    }
  }

  async findUserOrders(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: orders,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch user orders',
        error: error.message,
      };
    }
  }

  async create(data: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    try {
      // Calculate total price
      const totalPrice = data.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Create order with items
      const order = await this.prisma.order.create({
        data: {
          userId: data.userId,
          totalPrice,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return {
        success: true,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message,
      };
    }
  }

  async updateStatus(id: string, status: string) {
    try {
      // Validate status
      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        return {
          success: false,
          message: 'Invalid order status',
        };
      }

      const order = await this.prisma.order.update({
        where: { id },
        data: {
          status: status as OrderStatus,
        },
        include: {
          items: true,
        },
      });

      return {
        success: true,
        message: 'Order status updated successfully',
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update order status',
        error: error.message,
      };
    }
  }

  async cancel(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        return {
          success: false,
          message: 'Order not found',
        };
      }

      // Check if order can be cancelled
      if (['DELIVERED', 'CANCELLED'].includes(order.status)) {
        return {
          success: false,
          message: `Cannot cancel order with status ${order.status}`,
        };
      }

      const cancelledOrder = await this.prisma.order.update({
        where: { id },
        data: {
          status: OrderStatus.CANCELLED,
        },
        include: {
          items: true,
        },
      });

      return {
        success: true,
        message: 'Order cancelled successfully',
        data: cancelledOrder,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to cancel order',
        error: error.message,
      };
    }
  }
}
