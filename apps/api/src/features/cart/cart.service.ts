import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(sessionId?: string, userId?: string) {
    const where: any = {};
    if (sessionId) where.sessionId = sessionId;
    if (userId) where.userId = userId;

    const items = await this.prisma.cartItem.findMany({ where });
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return { items, total };
  }

  async addToCart(data: {
    profileId: number;
    plan: 'ONE_MONTH' | 'THREE_MONTHS' | 'SIX_MONTHS';
    price: number;
    sessionId?: string;
    userId?: string;
  }) {
    const item = await this.prisma.cartItem.create({ data });
    return item;
  }

  async removeFromCart(id: string) {
    await this.prisma.cartItem.delete({ where: { id } });
  }

  async clearCart(sessionId?: string, userId?: string) {
    const where: any = {};
    if (sessionId) where.sessionId = sessionId;
    if (userId) where.userId = userId;
    await this.prisma.cartItem.deleteMany({ where });
  }
}
