import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(data: { email: string; password: string }) {
    return this.authService.login(data);
  }

  @GrpcMethod('AuthService', 'Register')
  async register(data: { email: string; password: string; name: string }) {
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'Validate')
  async validate(data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}
