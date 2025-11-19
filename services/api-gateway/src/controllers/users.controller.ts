import { Controller, Get, Post, Put, Delete, Body, Param, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UsersService {
  getAllUsers(data: {}): Observable<any>;
  getUser(data: { id: string }): Observable<any>;
  createUser(data: { email: string; name: string; password: string }): Observable<any>;
  updateUser(data: { id: string; email?: string; name?: string }): Observable<any>;
  deleteUser(data: { id: string }): Observable<any>;
}

@Controller('users')
export class UsersController implements OnModuleInit {
  private usersService: UsersService;

  constructor(
    @Inject('USERS_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UsersService');
  }

  @Get()
  async findAll() {
    return this.usersService.getAllUsers({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.getUser({ id });
  }

  @Post()
  async create(@Body() createUserDto: { email: string; name: string; password: string }) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: { email?: string; name?: string },
  ) {
    return this.usersService.updateUser({ id, ...updateUserDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser({ id });
  }
}
