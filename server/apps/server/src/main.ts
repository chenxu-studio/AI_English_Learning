import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from '@en/config';
// 版本控制
import { VersioningType } from '@nestjs/common';
import { InterceptorInterceptor } from '@libs/shared/interceptor/interceptor';
import { InterceptorExceptionFilter } from '@libs/shared/interceptor/exceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new InterceptorInterceptor());
  app.useGlobalFilters(new InterceptorExceptionFilter());
  // 全局前缀(所有路由都添加/api前缀方便前端去处理)
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  }); // 设置版本号为1，默认版本号为1，版本号为1的接口在/api/v1/前缀下
  await app.listen(Config.ports.server);
}
bootstrap();
