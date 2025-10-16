import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { IPaginatedResult } from '../interfaces/paginated-result.interface';
import { IApiResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    const code = response.statusCode;

    return next.handle().pipe(
      map((data: T) => {
        if (this.isPaginatedResult(data)) {
          return {
            code,
            status: 'success',
            data: data.data as T,
            meta: data.meta,
          };
        }

        return {
          code,
          status: 'success',
          data,
        };
      }),
    );
  }

  private isPaginatedResult(data: unknown): data is IPaginatedResult<unknown> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      'meta' in data &&
      Array.isArray((data as IPaginatedResult<unknown>).data) &&
      typeof (data as IPaginatedResult<unknown>).meta === 'object'
    );
  }
}
