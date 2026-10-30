import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import fs from 'fs/promises';
import { Prisma } from '@prisma/client';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { EspacioRepository } from '../repositories/espacio.repository.js';
import { CroquisRepository } from '../repositories/croquis.repository.js';
import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { EstacionamientoMapper } from '../mappers/estacionamiento.mapper.js';
import { HostDefaultStructureFactory } from '../factories/host-default-structure.factory.js';
import {
  EstacionamientoProvisioningInput,
  EstacionamientoProvisioningStrategy,
} from './estacionamiento-provisioning.strategy.js';
import { DiaSemana } from '@prisma/client';

@Injectable()
export class HostResidentialProvisioningStrategy implements EstacionamientoProvisioningStrategy {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly nivelRepository: NivelRepository,
    private readonly espacioRepository: EspacioRepository,
    private readonly croquisRepository: CroquisRepository,
    private readonly defaultStructureFactory: HostDefaultStructureFactory,
  ) {}

  canHandle(roleName?: string): boolean {
    return roleName === 'HOST';
  }

  async provision(input: EstacionamientoProvisioningInput): Promise<EstacionamientoResponseDto> {
    const { dto, files, userId, providedTenantId } = input;

    // 1. Resolver o Crear Automáticamente el Tenant Personal del Anfitrión (Dueño de Casa)
    let tenantId = providedTenantId;
    if (!tenantId) {
      const userTenants = await this.tenantRepository.findByUsuarioId(userId);
      if (!userTenants || userTenants.length === 0) {
        const nuevoTenant = await this.tenantRepository.create({
          nombre: dto.nombre?.trim() || 'Cochera Residencial',
          nit: `RES-${Date.now().toString().slice(-8)}`,
          razonSocial: 'Anfitrión Particular C2C',
          direccion: dto.direccion,
          ciudad: 'Santa Cruz de la Sierra',
          latitud: dto.latitud,
          longitud: dto.longitud,
          usuarioId: userId,
        });
        tenantId = nuevoTenant.id;
      } else {
        tenantId = userTenants[0].id;
      }
    } else {
      const tenant = await this.tenantRepository.findById(tenantId);
      if (!tenant) {
        throw new NotFoundException('El tenant especificado no existe.');
      }
      if (tenant.usuarioId !== userId) {
        throw new ForbiddenException(
          'No tienes autorización para vincular este estacionamiento a una empresa que no te pertenece.',
        );
      }
    }

    // 2. REGLA ESTRICTA C2C: Solo 1 estacionamiento residencial por Anfitrión
    const existing = await this.estacionamientoRepository.findByTenantId(tenantId);
    if (existing) {
      throw new ConflictException(
        'Ya cuentas con una cochera particular registrada o en proceso de revisión.',
      );
    }

    // 3. Horarios: Si el anfitrión no configuró horarios explícitos, proveer horario estándar residencial
    const horariosFinales =
      dto.horarios && dto.horarios.length > 0
        ? dto.horarios
        : [
            { dia: DiaSemana.LUNES, horaInicio: '08:00', horaCierre: '20:00' },
            { dia: DiaSemana.MARTES, horaInicio: '08:00', horaCierre: '20:00' },
            { dia: DiaSemana.MIERCOLES, horaInicio: '08:00', horaCierre: '20:00' },
            { dia: DiaSemana.JUEVES, horaInicio: '08:00', horaCierre: '20:00' },
            { dia: DiaSemana.VIERNES, horaInicio: '08:00', horaCierre: '20:00' },
            { dia: DiaSemana.SABADO, horaInicio: '08:00', horaCierre: '20:00' },
            { dia: DiaSemana.DOMINGO, horaInicio: '08:00', horaCierre: '20:00' },
          ];

    // 4. Procesar y almacenar fotos de la fachada/cochera
    const fotosUrls: string[] = [];
    if (files && files.length > 0) {
      const uploadDir = path.resolve(process.cwd(), 'uploads', 'estacionamientos');
      await fs.mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${sanitizedName}`;
        const targetPath = path.join(uploadDir, uniqueFileName);

        if (file.buffer) {
          await fs.writeFile(targetPath, file.buffer);
        } else if (file.path) {
          await fs.copyFile(file.path, targetPath);
        }

        fotosUrls.push(`/uploads/estacionamientos/${uniqueFileName}`);
      }
    }

    // 5. Creación de la Cochera / Estacionamiento Residencial en estado PENDIENTE
    const createdEstacionamiento = await this.estacionamientoRepository.create({
      nombre: dto.nombre,
      direccion: dto.direccion,
      latitud: dto.latitud,
      longitud: dto.longitud,
      tenantId,
      fotosUrls,
      horarios: horariosFinales,
    });

    // 6. APROVISIONAMIENTO ATÓMICO AUTOMÁTICO (Factory Method: Nivel 1 + Espacio 1 + Croquis Base)
    const structure = this.defaultStructureFactory.createDefaultStructure();

    // 6.1. Autogeneración de Nivel Único
    const nivel = await this.nivelRepository.create({
      codigo: structure.nivel.codigo,
      estacionamientoId: createdEstacionamiento.id,
    });

    // 6.2. Autogeneración de Espacio Único
    const espacio = await this.espacioRepository.create({
      codigoEspacio: structure.espacio.codigoEspacio,
      tipo: structure.espacio.tipo,
      modalidad: structure.espacio.modalidad,
      estado: structure.espacio.estado,
      nivelId: nivel.id,
    });

    // 6.3. Autogeneración de Croquis Residencial 2D con la Plaza Colocada
    await this.croquisRepository.upsertByNivelId(nivel.id, {
      codigo: structure.croquis.codigo,
      anchoLienzo: structure.croquis.anchoLienzo,
      altoLienzo: structure.croquis.altoLienzo,
      fondoTipo: structure.croquis.fondoTipo,
      fondoOpacidad: structure.croquis.fondoOpacidad,
      contenido: structure.croquis.generarContenido(
        espacio.id,
        espacio.codigoEspacio,
      ) as unknown as Prisma.InputJsonValue,
    });

    return EstacionamientoMapper.toResponseDto(createdEstacionamiento);
  }
}
