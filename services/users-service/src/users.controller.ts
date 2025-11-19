import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'GetAllUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @GrpcMethod('UsersService', 'GetUser')
  findOne(data: { id: string }) {
    return this.usersService.findOne(data.id);
  }

  @GrpcMethod('UsersService', 'CreateUser')
  create(data: { email: string; name: string; password: string }) {
    return this.usersService.create(data);
  }

  @GrpcMethod('UsersService', 'UpdateUser')
  update(data: { id: string; email?: string; name?: string }) {
    return this.usersService.update(data.id, data);
  }

  @GrpcMethod('UsersService', 'DeleteUser')
  remove(data: { id: string }) {
    return this.usersService.remove(data.id);
  }
}
