import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async search(
    @Query('city') city?: string,
    @Query('minAge') minAge?: number,
    @Query('maxAge') maxAge?: number,
    @Query('gender') gender?: string,
    @Query('lang') lang?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.search({
      city,
      minAge: minAge ? Number(minAge) : undefined,
      maxAge: maxAge ? Number(maxAge) : undefined,
      gender,
      lang,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 6,
    });
  }
}
