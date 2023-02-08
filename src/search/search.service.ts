import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  async createSeachPost(createSearchDto: CreateSearchDto) {
    try {
      return this.elasticsearchService.index({
        index: 'products',
        body: createSearchDto,
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async searchText(text: string) {
    try {
      const result = await this.elasticsearchService.search({
        index: 'products',
        body: {
          query: {
            multi_match: {
              query: text,
              fields: ['productName', 'category', 'productCode'],
            },
          },
        },
      });
      const hits = result.body.hits.hits;
      if (!hits.length) {
        return 'No Data Found.';
      }
      let searchResult = [];
      hits.forEach((item) =>
        searchResult.push({ id: item._id, data: item._source }),
      );
      return searchResult;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async updateSearch(id: string, updateSearchDto: UpdateSearchDto) {
    try {
      const newBody: UpdateSearchDto = {
        productName: updateSearchDto.productName,
        category: updateSearchDto.category,
        productCode: updateSearchDto.productCode,
        price: updateSearchDto.price,
      };

      const script = Object.entries(newBody).reduce((result, [key, value]) => {
        return `${result} ctx._source.${key}='${value}';`;
      }, '');

      return this.elasticsearchService.updateByQuery({
        index: 'products',
        body: {
          query: {
            match: {
              _id: id,
            },
          },
          script: {
            source: script,
          },
        },
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async removeSearch(postId: string) {
    try {
      const deleteResult = await this.elasticsearchService.deleteByQuery({
        index: 'products',
        body: {
          query: {
            match: {
              _id: postId,
            },
          },
        },
      });
      return deleteResult;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
