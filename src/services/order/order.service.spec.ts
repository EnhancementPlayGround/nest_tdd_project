import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { BalanceService } from '../balance/balance.service';
import { EntityManager, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { Order } from './order.entity';
import { ProductService } from '../product/product.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('OrderService', () => {
  let orderService: OrderService;
  let entityManager: EntityManager;
  let balanceService: BalanceService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        BalanceService,
        ProductService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    entityManager = module.get<EntityManager>(EntityManager);
    orderRepository = module.get(getRepositoryToken(Order));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    balanceService = module.get<BalanceService>(BalanceService);
    productService = module.get<ProductService>(ProductService);
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      // Mock the necessary methods and services
      jest.spyOn(balanceService, 'getBalance').mockResolvedValue(1000);
      jest.spyOn(productService, 'getProductById').mockResolvedValue({
        id: 1,
        name: 'Product 1',
        price: 50,
        quantity: 10,
        inventory: 5,
      });

      jest
        .spyOn(entityManager, 'transaction')
        .mockImplementation(async (cb) => {
          const result = await cb(entityManager);

          // Assuming you have a method to create a mock order
          jest.spyOn(entityManager, 'save').mockResolvedValue(result);

          return result;
        });
      // Assuming you have a method to create a mock order
      const mockOrder = {
        id: 1,
        userId: 1,
        products: [{ productId: 1, quantity: 2 }],
      };

      // Call the createOrder method
      const createdOrder = await orderService.createOrder(1, [
        { productId: 1, quantity: 2 },
      ]);

      // Assertions
      expect(createdOrder).toEqual(mockOrder);

      // Optionally, you can add more assertions based on your specific logic
    });
  });
  describe('createOrder fail cases', async () => {
    it('should throw an error when creating an order with insufficient balance', async () => {
      jest.spyOn(balanceService, 'getBalance').mockResolvedValueOnce(10); // Mock the balance for the user
      await expect(
        orderService.createOrder(1, [{ productId: 1, quantity: 2 }]),
      ).rejects.toThrowError('Insufficient balance');
    });

    it('should throw an error when a product is not found during order creation', async () => {
      jest.spyOn(productService, 'getProductById').mockResolvedValueOnce(null); // Mock product details for getProductById

      await expect(
        orderService.createOrder(1, [{ productId: 1, quantity: 2 }]),
      ).rejects.toThrowError('Product with ID 1 not found');
    });

    it('should throw an error when there is not enough inventory during order creation', async () => {
      jest.spyOn(productService, 'getProductById').mockResolvedValueOnce({
        id: 1,
        price: 50,
        name: '양말',
        quantity: 3,
        inventory: 1,
      }); // Mock product details for getProductById

      await expect(
        orderService.createOrder(1, [{ productId: 1, quantity: 2 }]),
      ).rejects.toThrowError('Not enough inventory for product 1');
    });

    it('should throw an InternalServerErrorException when sending order data to the platform fails', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0); // Mock Math.random to always return 0
      jest.spyOn(orderService, 'sendOrderDataToPlatform').mockRejectedValueOnce(
        new InternalServerErrorException({
          message: 'Failed to send order to data platform.',
          errorMessage:
            "Something went wrong and we couldn't complete your request.",
        }),
      );

      await expect(
        orderService.sendOrderDataToPlatform(1),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
