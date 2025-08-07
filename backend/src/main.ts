import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  const app_name = configService.get<string>('app.name') || 'Unknown App';
  const version = configService.get<string>('app.version') || '?';
  const env = configService.get<string>('app.environment') || 'Unknown';
  const prefix = configService.get<string>('app.prefix');
  await app.listen(port);
  if (prefix) {
    app.setGlobalPrefix(prefix);
    logger.log(`API prefix set to: /${prefix}`);
  }
  logger.log(`Running ${app_name} v${version} on port ${port}`);
  logger.log(`Environment: ${env}`);
}
bootstrap();
