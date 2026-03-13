import { Controller, Get, Param, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  async getCities(@Query('lang') lang: 'en' | 'ru' = 'en') {
    return this.citiesService.findAll(lang);
  }

  @Get(':slug')
  async getCityBySlug(@Param('slug') slug: string) {
    return this.citiesService.findBySlug(slug);
  }
}
