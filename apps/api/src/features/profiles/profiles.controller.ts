import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Get(':id')
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async createProfile(@Body() body: any, @UploadedFile() file?: any) {
    const data = {
      ...body,
      avatar: file?.path || body.avatar,
      photos: body.photos ? JSON.parse(body.photos) : [],
      services: body.services ? JSON.parse(body.services) : [],
      languages: body.languages ? JSON.parse(body.languages) : [],
      workType: body.workType ? JSON.parse(body.workType) : [],
      age: parseInt(body.age),
      cityId: parseInt(body.cityId),
      height: body.height ? parseInt(body.height) : null,
      weight: body.weight ? parseInt(body.weight) : null,
      expiresAt: new Date(body.expiresAt),
    };

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
