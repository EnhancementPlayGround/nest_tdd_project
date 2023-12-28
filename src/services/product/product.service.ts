// src/product/product.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductDto } from './dto/product.dto';
import { OrderDetail } from '../order/order-detail.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
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
      inventory: product.inventory,
    };
  }

  async findTopSellingProducts(): Promise<Product[]> {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const topProducts = await this.orderDetailRepository
      .createQueryBuilder('order_detail')
      .select('product_id, SUM(quantity) as totalSold')
      .where('order_detail.createdAt > :threeDaysAgo', { threeDaysAgo })
      .groupBy('product_id')
      .orderBy('totalSold', 'DESC')
      .limit(5)
      .getRawMany();

    // Use the findBy method with In operator
    return this.productRepository.findBy({
      id: In(topProducts.map((p) => p.productId)),
    });
  }
}
