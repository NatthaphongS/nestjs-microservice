import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService implements OnModuleInit {
  private prisma = new PrismaClient();

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('Users Service: Prisma connected to database');
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch users',
        error: error.message,
      };
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch user',
        error: error.message,
      };
    }
  }

  async create(data: { email: string; name: string }) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: 'User created successfully',
        data: newUser,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create user',
        error: error.message,
      };
    }
  }

  async update(id: string, data: { email?: string; name?: string }) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: 'User not found or update failed',
        error: error.message,
      };
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'User not found or delete failed',
        error: error.message,
      };
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
