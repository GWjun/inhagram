import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunnerDecorator = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req.queryRunner)
      throw new InternalServerErrorException(
        'To use the QueryRunner Decorator, you need to apply a TransactionInterceptor.',
      );

    return req.queryRunner;
  },
);
