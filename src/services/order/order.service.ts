import { Injectable } from '@nestjs/common';
import { BalanceService } from '../balance/balance.service';
import { EntityManager, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { Order } from './order.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly balanceService: BalanceService,
    private readonly productService: ProductService,
  ) {}

  async getBalance(userId: string): Promise<number> {
    return this.balanceService.getBalance(userId);
  }

  async createOrder(
    userId: number,
    products: { productId: number; quantity: number }[],
  ): Promise<Order> {
    // 트랜잭션 시작
    const result = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const order = new Order(); // Create an instance of the Order entity

        for (const product of products) {
          const { productId, quantity } = product;
          await this.deductInventory(
            transactionalEntityManager,
            productId,
            quantity,
          );
        }

        const totalAmount = await this.calculateTotalAmount(products);
        await this.deductAmountFromBalance(
          transactionalEntityManager,
          userId,
          totalAmount,
        );

        // Save the order to the database
        return transactionalEntityManager.save(Order, order);
      },
    );
    return result;
  }

  sendOrderToDataPlatform(orderId: number): void {
    // Mock implementation of sending order information to data platform
    console.log('Sending order information to data platform:', orderId);
  }

  private async deductAmountFromBalance(
    entityManager: EntityManager,
    userId: number,
    amount: number,
  ): Promise<void> {
    await entityManager.update(User, userId, {
      balance: () => `balance - ${amount}`,
    });
  }

  private async deductInventory(
    entityManager: EntityManager,
    productId: number,
    quantity: number,
  ): Promise<void> {
    // Retrieve the product from the database
    const product = await entityManager.findOne(Product, {
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Check if there's enough inventory
    if (product.inventory < quantity) {
      throw new Error(`Not enough inventory for product ${productId}`);
    }

    // Deduct the inventory
    product.inventory -= quantity;

    // Save the updated product to the database
    await entityManager.save(Product, product);

    // 여기에서 상품의 재고를 차감하는 로직을 추가
    // transactionalEntityManager를 사용하여 트랜잭션 내에서 데이터베이스 조작을 수행
    await entityManager.update(Product, productId, {
      inventory: () => `inventory - ${quantity}`,
    });
  }

  private async calculateTotalAmount(
    products: { productId: number; quantity: number }[],
  ): Promise<number> {
    let totalAmount = 0;

    for (const product of products) {
      const { productId, quantity } = product;

      // Get product details by calling getProductById from ProductService
      const productDetails =
        await this.productService.getProductById(productId);

      // Check if the product is found
      if (productDetails) {
        // Calculate the total amount based on product price and quantity
        totalAmount += productDetails.price * quantity;
      }
    }

    return totalAmount;
  }

  private createOrderInfo(
    userId: string,
    items: { productId: number; quantity: number }[],
    totalAmount: number,
  ): any {
    // Implementation of creating order information object
    return { userId, items, totalAmount };
  }
}
