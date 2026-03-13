import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../features/auth/auth.module';
import { ProfilesModule } from '../features/profiles/profiles.module';
import { CitiesModule } from '../features/cities/cities.module';
import { SearchModule } from '../features/search/search.module';
import { CartModule } from '../features/cart/cart.module';
import { PaymentModule } from '../features/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    ProfilesModule,
    CitiesModule,
    SearchModule,
    CartModule,
    PaymentModule,
  ],
})
export class AppModule {}
