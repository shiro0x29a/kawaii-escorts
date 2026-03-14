import { Controller, Post, Get, Body, Param, Query, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Body() body: {
      profileId: number;
      amount: number;
      currency?: string;
      sessionId?: string;
      userId?: string;
    },
  ) {
    return this.paymentService.createPayment(body);
  }

  @Post(':id/checkout')
  async createCheckoutSession(
    @Param('id') id: string,
    @Query('successUrl') successUrl: string,
    @Query('cancelUrl') cancelUrl: string,
  ) {
    return this.paymentService.createCheckoutSession(id, successUrl, cancelUrl);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.paymentService.handleWebhook(signature, req.rawBody || Buffer.from(''));
  }
}
