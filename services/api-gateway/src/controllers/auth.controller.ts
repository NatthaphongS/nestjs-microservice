import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'login' }, loginDto),
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  async register(@Body() registerDto: { email: string; password: string; name: string }) {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'register' }, registerDto),
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('validate')
  async validate(@Body() validateDto: { token: string }) {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'validate' }, validateDto),
      );
    } catch (error) {
      throw error;
    }
  }
}
