// src/product/product.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductById(id: number): Promise<ProductDto> {
    const product = await this.productRepository.findOne({
      where: { id }, // Use an object to specify the where condition
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };
  }
}
