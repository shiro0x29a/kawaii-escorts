import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(
    @Query('sessionId') sessionId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.cartService.getCart(sessionId, userId);
  }

  @Post()
  async addToCart(
    @Body() body: {
      profileId: number;
      plan: 'ONE_MONTH' | 'THREE_MONTHS' | 'SIX_MONTHS';
      price: number;
      sessionId?: string;
      userId?: string;
    },
  ) {
    return this.cartService.addToCart(body);
  }

  @Delete(':id')
  async removeFromCart(@Param('id') id: string) {
    return this.cartService.removeFromCart(id);
  }

  @Delete()
  async clearCart(
    @Query('sessionId') sessionId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.cartService.clearCart(sessionId, userId);
  }
}
