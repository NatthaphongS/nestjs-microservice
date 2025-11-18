import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  // In-memory storage (for demo purposes)
  private users: User[] = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll() {
    return {
      success: true,
      data: this.users,
    };
  }

  findOne(id: string) {
    const user = this.users.find((u) => u.id === id);
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
  }

  create(data: { email: string; name: string }) {
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email: data.email,
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return {
      success: true,
      message: 'User created successfully',
      data: newUser,
    };
  }

  update(id: string, data: { email?: string; name?: string }) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;

    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    this.users.splice(userIndex, 1);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
