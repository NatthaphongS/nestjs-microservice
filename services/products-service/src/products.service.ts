import { Injectable } from '@nestjs/common';

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProductsService {
  // In-memory storage (for demo purposes)
  private products: Product[] = [
    {
      id: '1',
      name: 'Laptop',
      price: 999.99,
      description: 'High-performance laptop',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Mouse',
      price: 29.99,
      description: 'Wireless mouse',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Keyboard',
      price: 79.99,
      description: 'Mechanical keyboard',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll() {
    return {
      success: true,
      data: this.products,
    };
  }

  findOne(id: string) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }
    return {
      success: true,
      data: product,
    };
  }

  create(data: { name: string; price: number; description?: string }) {
    const newProduct: Product = {
      id: (this.products.length + 1).toString(),
      name: data.name,
      price: data.price,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return {
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  update(id: string, data: { name?: string; price?: number; description?: string }) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    const updatedProduct = {
      ...this.products[productIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.products[productIndex] = updatedProduct;

    return {
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  }

  remove(id: string) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    this.products.splice(productIndex, 1);

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
