import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  private prisma = new PrismaClient();

  constructor(private readonly jwtService: JwtService) {}

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('Auth Service: Prisma connected to database');
  }

  async register(data: { email: string; password: string; name: string }) {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create new user
      const newUser = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
        },
      });

      // Generate token
      const token = this.jwtService.sign({
        sub: newUser.id,
        email: newUser.email,
      });

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          },
          token,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed',
        error: error.message,
      };
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Generate token
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          token,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Login failed',
        error: error.message,
      };
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid token',
        };
      }

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid token',
      };
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
