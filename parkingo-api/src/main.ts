import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import { AppModule } from './app.module.js';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter.js';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RoleRepository } from './modules/roles/repositories/role.repository.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Confiar en el proxy (Nginx, Cloudflare, etc.) para que el Throttler bloquee la IP real del usuario
  app.set('trust proxy', 1);

  // Habilitar CORS para permitir peticiones desde las direcciones del frontend (cargadas desde .env)
  const configuredOrigins = (process.env.FRONTEND_ORIGINS || process.env.CORS_ORIGINS)
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = configuredOrigins && configuredOrigins.length > 0
    ? configuredOrigins
    : [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
      ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Proteger el acceso directo a documentos sensibles de verificación (/uploads/verification_documents)
  const jwtService = app.get(JwtService);
  const roleRepository = app.get(RoleRepository);
  app.use('/uploads/verification_documents', async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authHeader = req.headers.authorization;
    const queryToken = typeof req.query?.token === 'string' ? req.query.token : undefined;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : queryToken;

    if (!bearerToken) {
      res.status(401).json({ statusCode: 401, message: 'Autenticación requerida para acceder a documentos de verificación.' });
      return;
    }

    try {
      const payload = await jwtService.verifyAsync<{ sub: string; roleId: string; roleName?: string }>(bearerToken);
      let roleName = payload.roleName;
      if (!roleName && payload.roleId) {
        const role = await roleRepository.findById(payload.roleId);
        roleName = role?.name;
      }

      const normalizedRole = (roleName ?? '').toUpperCase();
      const isAdmin = normalizedRole === 'SUPER_ADMIN' || normalizedRole === 'GENERAL_ADMIN';
      const isDocumentOwner = Boolean(payload.sub && req.path.includes(payload.sub));

      if (!isAdmin && !isDocumentOwner) {
        res.status(403).json({ statusCode: 403, message: 'No tienes permisos para acceder a este documento de verificación.' });
        return;
      }

      next();
    } catch {
      res.status(401).json({ statusCode: 401, message: 'Token inválido o expirado para consultar el documento.' });
    }
  });

  // Servir archivos estáticos subidos (fotos de estacionamientos, planos de croquis y documentos protegidos)
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Habilitar validaciones globales usando class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si envían propiedades no definidas
    transform: true, // Transforma automáticamente los payloads a las instancias del DTO
  }));

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
