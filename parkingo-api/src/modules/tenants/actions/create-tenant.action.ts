import { ConflictException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { TenantStatus } from '@prisma/client';
import { CreateTenantDto } from '../dto/create-tenant.dto.js';
import { TenantResponseDto } from '../dto/tenant-response.dto.js';
import { TenantRepository } from '../repositories/tenant.repository.js';
import { TenantMapper } from '../mappers/tenant.mapper.js';
import { MailerService } from '../../mailer/mailer.service.js';

interface RequestingUser {
  userId: string;
  email: string;
  roleName: string;
}

@Injectable()
export class CreateTenantAction {
  private readonly logger = new Logger(CreateTenantAction.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly mailerService: MailerService,
  ) {}

  async execute(dto: CreateTenantDto, user: RequestingUser): Promise<TenantResponseDto> {
    if (user.roleName !== 'PARKING_ADMIN') {
      throw new ForbiddenException(
        'Únicamente los Administradores de Parqueo están autorizados para registrar nuevas empresas / tenants.'
      );
    }

    const existingByNit = await this.tenantRepository.findByNit(dto.nit.trim());
    if (existingByNit) {
      throw new ConflictException(
        `Ya existe una empresa registrada con el NIT ${dto.nit}. Verifique los datos o consulte con soporte.`
      );
    }

    // Creación automática en estado ACTIVO y vinculada al usuario
    const created = await this.tenantRepository.create({
      nombre: dto.nombre.trim(),
      nit: dto.nit.trim(),
      razonSocial: dto.razonSocial.trim(),
      estado: TenantStatus.ACTIVO,
      direccion: dto.direccion?.trim(),
      ciudad: dto.ciudad?.trim(),
      latitud: dto.latitud,
      longitud: dto.longitud,
      usuarioId: user.userId,
    });

    const responseDto = TenantMapper.toDto(created);

    // Despacho del correo de confirmación de creación
    const adminFullName = created.usuario
      ? `${created.usuario.firstName} ${created.usuario.lastName}`.trim()
      : 'Administrador de Parqueo';

    const fechaLegible = new Date(created.createdAt).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Envío asíncrono sin bloquear la respuesta inmediata
    this.mailerService
      .sendTenantCreatedConfirmationEmail(user.email, adminFullName, {
        nombre: created.nombre,
        nit: created.nit,
        razonSocial: created.razonSocial,
        estado: created.estado,
        fecha: fechaLegible,
      })
      .catch((err) => {
        this.logger.error(`Error enviando correo de confirmación de Tenant a ${user.email}:`, err);
      });

    return responseDto;
  }
}
