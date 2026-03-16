import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  async getProfiles(
    @Query('cityId', new ParseIntPipe({ optional: true })) cityId?: number,
    @Query('gender') gender?: string,
    @Query('minAge', new ParseIntPipe({ optional: true })) minAge?: number,
    @Query('maxAge', new ParseIntPipe({ optional: true })) maxAge?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.profilesService.findAll({ cityId, gender, minAge, maxAge, page, limit });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyProfiles(@Query('userId') userId: string) {
    return this.profilesService.findByUser(userId);
  }

  @Get(':id')
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async createProfile(@Body() body: any, @UploadedFile() file?: any) {
    const photos = body.photos ? (Array.isArray(body.photos) ? body.photos : JSON.parse(body.photos)) : [];
    
    const data: any = {
      ...body,
      avatar: file?.path || body.avatar,
      photos: photos,
      services: body.services ? (typeof body.services === 'string' ? JSON.parse(body.services) : body.services) : [],
      languages: body.languages ? (typeof body.languages === 'string' ? JSON.parse(body.languages) : body.languages) : [],
      workType: body.workType ? (typeof body.workType === 'string' ? JSON.parse(body.workType) : body.workType) : [],
      age: parseInt(body.age),
      cityId: parseInt(body.cityId),
      height: body.height ? parseInt(body.height) : null,
      weight: body.weight ? parseInt(body.weight) : null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    // Add userId if provided
    if (body.userId) {
      data.userId = body.userId;
    }

    return this.profilesService.create(data);
  }

  @Put(':id')
  async updateProfile(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.profilesService.update(id, body);
  }

  @Delete(':id')
  async removeProfile(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.remove(id);
  }
}
