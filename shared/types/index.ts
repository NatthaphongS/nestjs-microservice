// Shared types across microservices

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  };
}

export interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Message patterns
export enum AuthMessagePatterns {
  LOGIN = 'login',
  REGISTER = 'register',
  VALIDATE = 'validate',
}

export enum UsersMessagePatterns {
  GET_ALL = 'get_all_users',
  GET_ONE = 'get_user',
  CREATE = 'create_user',
  UPDATE = 'update_user',
  DELETE = 'delete_user',
}

export enum ProductsMessagePatterns {
  GET_ALL = 'get_all_products',
  GET_ONE = 'get_product',
  CREATE = 'create_product',
  UPDATE = 'update_product',
  DELETE = 'delete_product',
}
