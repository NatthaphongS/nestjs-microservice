import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Get()
  async findAll() {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'get_all_users' }, {}),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'get_user' }, { id }),
    );
  }

  @Post()
  async create(@Body() createUserDto: { email: string; name: string }) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'create_user' }, createUserDto),
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: { email?: string; name?: string },
  ) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'update_user' }, { id, ...updateUserDto }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'delete_user' }, { id }),
    );
  }
}
