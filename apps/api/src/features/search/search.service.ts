import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: {
    city?: string;
    minAge?: number;
    maxAge?: number;
    gender?: string;
    lang?: string;
  }) {
    const where: any = { isActive: true };

    if (query.city) {
      const city = await this.prisma.city.findFirst({
        where: {
          OR: [
            { slug: query.city },
            { nameEn: { contains: query.city, mode: 'insensitive' } },
            { nameRu: { contains: query.city, mode: 'insensitive' } },
          ],
        },
      });

      if (city) {
        where.cityId = city.id;
      } else {
        return { data: [], pagination: { page: 1, limit: 0, total: 0, pages: 0 } };
      }
    }

    if (query.gender) {
      where.gender = query.gender;
    }

    if (query.minAge || query.maxAge) {
      where.age = {};
      if (query.minAge) where.age.gte = query.minAge;
      if (query.maxAge) where.age.lte = query.maxAge;
    }

    const profiles = await this.prisma.profile.findMany({
      where,
      include: { city: true },
      orderBy: { createdAt: 'desc' },
    });

    let filtered = profiles;

    if (query.lang) {
      filtered = profiles.filter((p: any) => {
        const languages = typeof p.languages === 'string' ? JSON.parse(p.languages) : p.languages;
        return languages?.includes(query.lang);
      });
    }

    return {
      data: filtered.map((p: any) => ({
        ...p,
        services: typeof p.services === 'string' ? JSON.parse(p.services) : p.services,
        languages: typeof p.languages === 'string' ? JSON.parse(p.languages) : p.languages,
        workType: typeof p.workType === 'string' ? JSON.parse(p.workType) : p.workType,
        city: {
          id: p.city.id,
          nameEn: p.city.nameEn,
          nameRu: p.city.nameRu,
          slug: p.city.slug,
        },
      })),
      pagination: { page: 1, limit: filtered.length, total: filtered.length, pages: 1 },
    };
  }
}
