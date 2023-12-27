import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalDataService {
  async sendPaymentStatus(orderId: string, success: boolean): Promise<void> {
    const externalPlatformUrl =
      'https://external-platform.com/api/payment/status';

    try {
      await axios.post(externalPlatformUrl, { orderId, success });
    } catch (error) {
      console.error(
        `Failed to send payment status to external platform for order ${orderId}`,
        error,
      );
      throw new Error('Failed to communicate with external platform');
    }
  }
}
