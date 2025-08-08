import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/exceptions';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as morgan from 'morgan';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  const app_name = configService.get<string>('app.name') || 'Unknown App';
  const version = configService.get<string>('app.version') || '?';
  const env = configService.get<string>('app.environment') || 'Unknown';
  const prefix = configService.get<string>('app.prefix');
  const morgan_format = env === 'production' ? 'combined' : 'dev';
  app.use(morgan(morgan_format));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  logger.log(`Using morgan: ${morgan_format}`);
  app.useGlobalFilters(new AllExceptionsFilter());
  if (prefix) {
    app.setGlobalPrefix(prefix);
    logger.log(`API prefix set to: ${prefix}`);
  }
  await app.listen(port);
  logger.log(`Running ${app_name} v${version} on port ${port}`);
  logger.log(`Environment: ${env}`);
}
bootstrap();
