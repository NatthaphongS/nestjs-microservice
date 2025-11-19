// Shared types across microservices
// These types align with the gRPC proto definitions

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
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: string;
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

// gRPC Service Names (used by API Gateway)
export enum GrpcServices {
  AUTH = 'AuthService',
  USERS = 'UsersService',
  PRODUCTS = 'ProductsService',
  ORDERS = 'OrdersService',
}

// gRPC Method Names
export enum AuthMethods {
  LOGIN = 'Login',
  REGISTER = 'Register',
  VALIDATE = 'Validate',
}

export enum UsersMethods {
  GET_ALL = 'GetAllUsers',
  GET_ONE = 'GetUser',
  CREATE = 'CreateUser',
  UPDATE = 'UpdateUser',
  DELETE = 'DeleteUser',
}

export enum ProductsMethods {
  GET_ALL = 'GetAllProducts',
  GET_ONE = 'GetProduct',
  CREATE = 'CreateProduct',
  UPDATE = 'UpdateProduct',
  DELETE = 'DeleteProduct',
}

export enum OrdersMethods {
  GET_ALL = 'GetAllOrders',
  GET_ONE = 'GetOrder',
  GET_USER_ORDERS = 'GetUserOrders',
  CREATE = 'CreateOrder',
  UPDATE_STATUS = 'UpdateOrderStatus',
  CANCEL = 'CancelOrder',
}
