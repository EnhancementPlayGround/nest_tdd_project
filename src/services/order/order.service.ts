import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BalanceService } from '../balance/balance.service';
import { EntityManager, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { Order } from './order.entity';
import { ProductService } from '../product/product.service';
import { InventoryManager } from '../product/interfaces/inventory-manager.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly balanceService: BalanceService,
    private readonly productService: ProductService,
    private inventoryManager: InventoryManager,
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
          await this.inventoryManager.deductInventory(
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

  private async deductAmountFromBalance(
    entityManager: EntityManager,
    userId: number,
    amount: number,
  ): Promise<void> {
    await entityManager.update(User, userId, {
      balance: () => `balance - ${amount}`,
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

  async sendOrderDataToPlatform(orderId: number): Promise<void> {
    if (Math.random() < 0.01) {
      throw new InternalServerErrorException({
        message: 'Failed to send order to data platform.',
        errorMessage:
          "Something went wrong and we couldn't complete your request.",
      });
    }
    console.log(`Order data sent to platform for orderId: ${orderId}`);
  }
}
