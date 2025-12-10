import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Ustawienia CORS – aby frontend (Next.js na porcie 3000) mógł się łączyć
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
  });

  // Walidacja danych w DTO (opcjonalnie, ale bardzo zalecane)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Zmieniamy port backendu na 3001, aby nie kolidował z Next.js
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 NestJS backend działa na http://localhost:${port}`);
}
bootstrap();
