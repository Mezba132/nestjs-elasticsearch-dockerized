import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('search')
@ApiTags('Search - CRUD')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('create')
  async createSeachPost(@Body() createSearchDto: CreateSearchDto) {
    return await this.searchService.createSeachPost(createSearchDto);
  }

  @Get()
  async searchText(@Query('search') search: string) {
    return await this.searchService.searchText(search);
  }

  @Patch(':id')
  async updateSearch(
    @Param('id') id: string,
    @Body() updateSearchDto: UpdateSearchDto,
  ) {
    return await this.searchService.updateSearch(id, updateSearchDto);
  }

  @Delete(':id')
  removeSearch(@Param('id') id: string) {
    return this.searchService.removeSearch(id);
  }
}
