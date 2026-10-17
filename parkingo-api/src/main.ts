import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { AppModule } from './app.module.js';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter.js';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Confiar en el proxy (Nginx, Cloudflare, etc.) para que el Throttler bloquee la IP real del usuario
  app.set('trust proxy', 1);

  // Servir archivos estáticos subidos (documentación PDF de verificación, comprobantes, etc.)
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Habilitar validaciones globales usando class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si envían propiedades no definidas
    transform: true, // Transforma automáticamente los payloads a las instancias del DTO
  }));
  // Habilitar CORS para permitir peticiones desde el frontend (Vite)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Prefijo global para todos los endpoints de la API
  app.setGlobalPrefix('api');

  // Configurar Filtro Global de Errores de Prisma
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('ParkinGo API')
    .setDescription('Documentación de los endpoints de la API de ParkinGo')
    .setVersion('1.0')
    .addBearerAuth() // Permite probar endpoints protegidos por JWT en la UI
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
