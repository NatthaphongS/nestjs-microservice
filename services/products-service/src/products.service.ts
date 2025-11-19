import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService implements OnModuleInit {
  private prisma = new PrismaClient();

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('Products Service: Prisma connected to database');
  }

  async findAll() {
    try {
      const products = await this.prisma.product.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      };
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch product',
        error: error.message,
      };
    }
  }

  async create(data: { name: string; price: number; description?: string }) {
    try {
      const newProduct = await this.prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
        },
      });

      return {
        success: true,
        message: 'Product created successfully',
        data: newProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create product',
        error: error.message,
      };
    }
  }

  async update(id: string, data: { name?: string; price?: number; description?: string }) {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data,
      });

      return {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Product not found or update failed',
        error: error.message,
      };
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Product not found or delete failed',
        error: error.message,
      };
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
