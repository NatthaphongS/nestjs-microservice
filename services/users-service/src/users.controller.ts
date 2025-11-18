import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'get_all_users' })
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'get_user' })
  findOne(data: { id: string }) {
    return this.usersService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'create_user' })
  create(data: { email: string; name: string }) {
    return this.usersService.create(data);
  }

  @MessagePattern({ cmd: 'update_user' })
  update(data: { id: string; email?: string; name?: string }) {
    return this.usersService.update(data.id, data);
  }

  @MessagePattern({ cmd: 'delete_user' })
  remove(data: { id: string }) {
    return this.usersService.remove(data.id);
  }
}
