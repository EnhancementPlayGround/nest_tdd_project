// src/product/product.controller.ts

import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<ProductDto> {
    return this.productService.getProductById(id);
  }
}
