import { Controller, Post, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AuthService {
  login(data: { email: string; password: string }): Observable<any>;
  register(data: { email: string; password: string; name: string }): Observable<any>;
  validate(data: { token: string }): Observable<any>;
}

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthService;

  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: { email: string; password: string; name: string }) {
    return this.authService.register(registerDto);
  }

  @Post('validate')
  async validate(@Body() validateDto: { token: string }) {
    return this.authService.validate(validateDto);
  }
}
