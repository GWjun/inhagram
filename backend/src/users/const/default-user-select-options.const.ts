import { FindManyOptions } from 'typeorm';

export const DEFAULT_USER_SELECT_OPTIONS = <T>(): FindManyOptions<T> => ({
  select: {
    id: true,
    nickname: true,
    image: true,
  } as any,
});
