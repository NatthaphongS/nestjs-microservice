import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

@Injectable()
export class AuthService {
  // In-memory user storage (for demo purposes)
  // In production, use a real database
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {
    // Create a demo user
    this.users.push({
      id: '1',
      email: 'demo@example.com',
      password: bcrypt.hashSync('password123', 10),
      name: 'Demo User',
    });
  }

  async register(data: { email: string; password: string; name: string }) {
    // Check if user already exists
    const existingUser = this.users.find((u) => u.email === data.email);
    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new user
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email: data.email,
      password: hashedPassword,
      name: data.name,
    };

    this.users.push(newUser);

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
  }

  async login(data: { email: string; password: string }) {
    // Find user
    const user = this.users.find((u) => u.email === data.email);
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
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = this.users.find((u) => u.id === payload.sub);

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
}
