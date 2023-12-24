// src/product/product.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepository = {
  findOne: jest.fn(),
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
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
      mockRepository.findOne.mockReturnValue(mockProduct);

      const result = await service.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(mockRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOne.mockReturnValue(undefined);

      await expect(service.getProductById(1)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith(1);
    });
  });
});
