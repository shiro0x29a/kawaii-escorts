import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createPayment(data: {
    profileId: number;
    amount: number;
    currency?: string;
    sessionId?: string;
    userId?: string;
  }) {
    const payment = await this.prisma.payment.create({
      data: {
        profileId: data.profileId,
        amount: data.amount,
        currency: data.currency || 'usd',
        sessionId: data.sessionId,
        userId: data.userId,
        status: 'PENDING',
      },
    });

    return payment;
  }

  async createCheckoutSession(paymentId: string, successUrl: string, cancelUrl: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new Error('Payment not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: payment.currency,
            product_data: { name: 'Profile Promotion' },
            unit_amount: payment.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { paymentId: payment.id },
    });

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { stripeSessionId: session.id },
    });

    return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get('STRIPE_WEBHOOK_SECRET') || '',
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentId = session.metadata?.paymentId;

      if (paymentId) {
        await this.prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'COMPLETED', stripeSessionId: session.id },
        });
      }
    }

    return { received: true };
  }
}
