import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({//para que funcionen los pipes
      whitelist: true // activa la whitelist
    }
  )); 
  await app.listen(3333); /**Puerto en donde se ejecuta la app */
}
bootstrap();
