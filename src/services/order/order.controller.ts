import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place-order')
  async createOrder(
    @Body()
    orderRequest: {
      userId: number;
      items: { productId: number; quantity: number }[];
    },
  ): Promise<string> {
    try {
      const resultOrder = await this.orderService.createOrder(
        orderRequest.userId,
        orderRequest.items,
      );

      if (resultOrder) {
        await this.orderService.sendOrderDataToPlatform(resultOrder.id);
        return 'Order placed successfully';
      } else {
        throw new HttpException(
          'Order placement failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
