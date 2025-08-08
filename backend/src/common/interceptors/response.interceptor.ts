import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  [key: string]: any;
}

interface ResponseFormat<T> {
  message?: string;
  data?: T;
  pagination?: Pagination;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: ResponseFormat<T>) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;

        const { pagination, message, data } = response;

        return {
          statusCode,
          success: statusCode >= 200 && statusCode < 300,
          message: message || 'No message provided',
          path: res.req.url,
          method: res.req.method,
          data: data ?? (message ? undefined : response),
          timestamp: new Date().toISOString(),

          ...(pagination ? { meta: { pagination } } : {}),
        };
      }),
    );
  }
}
