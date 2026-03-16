import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      preservePath: true,
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
