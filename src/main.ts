import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IConfig } from './config/config.interface';
import { rainbow } from '@colors/colors/safe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'verbose', 'error', 'log', 'warn'],
  });
  const configService: ConfigService<IConfig> = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT');
  await app.listen(port, () => {
    Logger.log(
      `🚀 ${rainbow(` Application is running on: http://localhost:${port}`)}`,
    );
  });
}
bootstrap();
