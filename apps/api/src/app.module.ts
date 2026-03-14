import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { CitiesModule } from './features/cities/cities.module';
import { ProfilesModule } from './features/profiles/profiles.module';
import { CartModule } from './features/cart/cart.module';
import { SearchModule } from './features/search/search.module';
import { PaymentModule } from './features/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    CitiesModule,
    ProfilesModule,
    CartModule,
    SearchModule,
    PaymentModule,
  ],
})
export class AppModule {}
