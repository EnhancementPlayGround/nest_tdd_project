import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { NotFoundException } from '@nestjs/common';
import { OrderDetail } from '../order/order-detail.entity';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let orderDetailRepository: MockRepository<OrderDetail>;
  let productRepository: MockRepository<Product>;

  // Create a mock repository factory
  const mockRepository = jest.fn(() => ({
    findOne: jest.fn(),
    findBy: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    })),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(OrderDetail),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    orderDetailRepository = module.get(getRepositoryToken(OrderDetail));
    productRepository = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProductById', () => {
    it('should return product if found', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 20.5,
        quantity: 50,
      };
      productRepository.findOne.mockReturnValue(Promise.resolve(mockProduct));

      const result = await service.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      productRepository.findOne.mockReturnValue(Promise.resolve(undefined));

      await expect(service.getProductById(1)).rejects.toThrowError(
        NotFoundException,
      );
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('findTopSellingProducts', () => {
    it('should return an array of products', async () => {
      const mockProducts = [new Product(), new Product()];
      const mockProductIds = mockProducts.map((product) => ({
        productId: product.id,
      }));

      orderDetailRepository
        .createQueryBuilder()
        .getRawMany.mockResolvedValue(mockProductIds);
      productRepository.findBy.mockResolvedValue(mockProducts);

      const result = await service.findTopSellingProducts();

      expect(result).toEqual(mockProducts);
      expect(productRepository.findBy).toHaveBeenCalledWith({
        id: expect.anything(),
      });
    });
  });

});

// Helper type for mocking repositories
type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;
