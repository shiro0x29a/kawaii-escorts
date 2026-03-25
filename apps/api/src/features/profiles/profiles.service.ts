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
    const { cityId, gender, minAge, maxAge, isActive = true, limit = 24 } = filters;

    const where: any = { isActive };

    if (cityId) where.cityId = cityId;
    if (gender) where.gender = gender;
    if (minAge || maxAge) {
      where.age = {};
      if (minAge) where.age.gte = minAge;
      if (maxAge) where.age.lte = maxAge;
    }

    const profiles = await this.prisma.profile.findMany({
      where,
      include: { city: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const total = profiles.length;

    return {
      data: profiles.map((p: any) => this.mapProfile(p)),
      pagination: { page: 1, limit, total, pages: Math.ceil(total / 6) },
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
    // Convert string values to appropriate types for numeric fields
    const processedData: any = { ...data };

    if (data.height !== undefined && data.height !== null) {
      processedData.height = parseInt(data.height) || null;
    }

    if (data.weight !== undefined && data.weight !== null) {
      processedData.weight = parseInt(data.weight) || null;
    }

    if (data.age !== undefined && data.age !== null) {
      processedData.age = parseInt(data.age) || null;
    }

    // Handle city field update - find city by name and set the cityId
    if (data.city) {
      // Look for city by name (checking both nameEn and nameRu)
      const city = await this.prisma.city.findFirst({
        where: {
          OR: [
            { nameEn: data.city },
            { nameRu: data.city },
          ],
        },
      });

      if (city) {
        processedData.cityId = city.id;
        delete processedData.city; // Remove the city string from the update data
      }
    }

    const profile = await this.prisma.profile.update({
      where: { id },
      data: {
        ...processedData,
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

  async findByUser(userId: string, page: number = 1, limit: number = 24) {
    const profiles = await this.prisma.profile.findMany({
      where: { userId },
      include: { city: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const total = profiles.length;

    return {
      data: profiles.map((p: any) => this.mapProfile(p)),
      pagination: { page: 1, limit, total, pages: Math.ceil(total / 6) },
    };
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
