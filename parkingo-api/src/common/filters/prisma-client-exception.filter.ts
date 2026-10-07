import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

// Con @Catch le decimos a NestJS que este filtro atrapará EXCLUSIVAMENTE los errores de Prisma
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
    
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        switch (exception.code) {
            case 'P2002': // Conflicto: Se violó una restricción "Unique"
                const statusConflict = HttpStatus.CONFLICT;
                response.status(statusConflict).json({
                    statusCode: statusConflict,
                    message: "Conflicto en los datos: Ya existe un registro con esta información única.",
                    error: "Conflict"
                });
                break;
                
            case 'P2025': // Not Found: Algo se intentó borrar/actualizar y no existe
                const statusNotFound = HttpStatus.NOT_FOUND;
                response.status(statusNotFound).json({
                    statusCode: statusNotFound,
                    message: "El recurso solicitado no fue encontrado en la base de datos.",
                    error: "Not Found"
                });
                break;

            default:
                // Si es un error raro de Prisma que no mapeamos, dejamos que NestJS lo maneje como un 500
                super.catch(exception, host);
                break;
        }
    }
}
