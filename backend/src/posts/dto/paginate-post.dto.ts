import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginatePostDto extends BasePaginationDto {
  @IsNumber()
  @IsOptional()
  where__likeCount__more_than: number;

  @IsNumber()
  @IsOptional()
  where__title_i_like: number;

  @IsString()
  @IsOptional()
  where__author: string;
}
