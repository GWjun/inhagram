/* eslint-disable @typescript-eslint/no-unused-vars */

import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseModel } from './entity/base.entity';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    return this.cursorPaginate(dto, repository, overrideFindOptions, path);
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = await this.composeFindOptions<T>(dto);

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const lastItem =
      results.length > 0 && results.length === dto.take
        ? results[results.length - 1]
        : null;

    const PROTOCOL = this.configService.get('PROTOCOL');
    const HOST = this.configService.get('HOST');
    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/${path}`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (key !== 'where__id__more_than' && key !== 'where__id__more_than')
            nextUrl.searchParams.append(key, dto[key]);
        }
      }

      const key =
        dto.order__createdAt === 'ASC'
          ? 'where__id__more_than'
          : 'where__id__less_than';

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: results,
      cursor: { after: lastItem?.id ?? null },
      count: results.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  private async composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): Promise<FindManyOptions<T>> {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...(await this.parseWhereFilter(key, value)),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...(await this.parseWhereFilter(key, value)),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
    };
  }

  private async parseWhereFilter<T extends BaseModel>(
    key: string,
    value: any,
  ): Promise<FindOptionsWhere<T> | FindOptionsOrder<T>> {
    const options: FindOptionsWhere<T> = {};

    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3)
      throw new BadRequestException(`where filter error : ${key}`);

    if (split.length === 2) {
      const [_, field] = split;

      if (field === 'author') {
        const userId = await this.usersService.getIdByNickname(value);
        options[field] = { id: userId };
      } else options[field] = value;
    } else {
      const [_, field, operator] = split;

      if (operator === 'i_like')
        options[field] = FILTER_MAPPER[operator](`%${value}%`);
      else options[field] = FILTER_MAPPER[operator](value);
    }

    return options;
  }
}
