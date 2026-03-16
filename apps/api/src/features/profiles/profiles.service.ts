import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: {
    cityId?: number;
    gender?: string;
    minAge?: number;
    maxAge?: number;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { cityId, gender, minAge, maxAge, isActive = true, page = 1, limit = 20 } = filters;

    const where: any = { isActive };

    if (cityId) where.cityId = cityId;
    if (gender) where.gender = gender;
    if (minAge || maxAge) {
      where.age = {};
      if (minAge) where.age.gte = minAge;
      if (maxAge) where.age.lte = maxAge;
    }

    const [profiles, total] = await Promise.all([
      this.prisma.profile.findMany({
        where,
        include: { city: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.profile.count({ where }),
    ]);

    return {
      data: profiles.map((p: any) => this.mapProfile(p)),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: { city: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.mapProfile(profile);
  }

  async create(data: any) {
    const profile = await this.prisma.profile.create({
      data: {
        ...data,
        services: JSON.stringify(data.services || []),
        languages: JSON.stringify(data.languages || []),
        workType: JSON.stringify(data.workType || []),
      },
      include: { city: true },
    });

    return this.mapProfile(profile);
  }

  async update(id: number, data: any) {
    const profile = await this.prisma.profile.update({
      where: { id },
      data: {
        ...data,
        services: data.services ? JSON.stringify(data.services) : undefined,
        languages: data.languages ? JSON.stringify(data.languages) : undefined,
        workType: data.workType ? JSON.stringify(data.workType) : undefined,
      },
      include: { city: true },
    });

    return this.mapProfile(profile);
  }

  async remove(id: number) {
    await this.prisma.profile.delete({ where: { id } });
  }

  async findByUser(userId: string) {
    const profiles = await this.prisma.profile.findMany({
      where: { userId },
      include: { city: true },
      orderBy: { createdAt: 'desc' },
    });

    return profiles.map((p: any) => this.mapProfile(p));
  }

  private mapProfile(profile: any) {
    return {
      ...profile,
      services: typeof profile.services === 'string' ? JSON.parse(profile.services) : profile.services,
      languages: typeof profile.languages === 'string' ? JSON.parse(profile.languages) : profile.languages,
      workType: typeof profile.workType === 'string' ? JSON.parse(profile.workType) : profile.workType,
      city: {
        id: profile.city.id,
        nameEn: profile.city.nameEn,
        nameRu: profile.city.nameRu,
        slug: profile.city.slug,
      },
    };
  }
}
