import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang: 'en' | 'ru' = 'en') {
    const cities = await this.prisma.city.findMany({
      orderBy: { nameEn: 'asc' },
    });

    return cities.map((city: { id: number; nameRu: string; nameEn: string; slug: string }) => ({
      id: city.id,
      name: lang === 'ru' ? city.nameRu : city.nameEn,
      slug: city.slug,
    }));
  }

  async findBySlug(slug: string) {
    return this.prisma.city.findUnique({ where: { slug } });
  }
}
