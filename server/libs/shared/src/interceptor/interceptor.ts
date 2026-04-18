import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request } from 'express';

function getType(target: unknown): string {
  const originType: string = Object.prototype.toString.call(target) as string;
  const type = originType.slice(8, -1);
  return type.toLowerCase();
}

// 存在BigInt类型识别不了的bug
function transformBigInt(data: unknown): unknown {
  if (typeof data === 'bigint') return data.toString();
  if (data instanceof Date) return data;
  // 在数组 or 对象中, 使用递归进行将bigInt类型转换成String的操作
  if (Array.isArray(data)) {
    return data.map((item) => transformBigInt(item));
  }
  if (getType(data) === 'object') {
    const entries = Object.entries(data as Record<string, unknown>).map(
      ([key, value]): [string, unknown] => [key, transformBigInt(value)],
    );
    return Object.fromEntries(entries);
  }
  return data;
}

@Injectable()
export class InterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 将通用上下文切换至http上下文
    const ctx = context.switchToHttp();
    // 获取当前http请求的详细信息
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        return {
          timestamp: new Date().toISOString(),
          data: transformBigInt(data?.data) ?? null,
          path: request.url,
          message: data?.message || '请求成功',
          code: data?.code || 200,
          success: true,
        };
      }),
    );
  }
}
