import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validaciones globales usando class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si envían propiedades no definidas
    transform: true, // Transforma automáticamente los payloads a las instancias del DTO
  }));

  // Configurar Filtro Global de Errores de Prisma
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
