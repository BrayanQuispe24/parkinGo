import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { ReservaRepository } from '../repositories/reserva.repository.js';
import { CrearReservaDto } from '../dto/crear-reserva.dto.js';
import { BoletaReservaResponseDto } from '../dto/reserva-response.dto.js';
import { ReservaMapper } from '../mappers/reserva.mapper.js';
import {
  ReservaPriceAssembler,
  ParametrosEspacioEnsamblaje,
} from '../domain/decorator/reserva-price.assembler.js';

@Injectable()
export class CrearReservaAction {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    user: { id?: string; userId?: string; role?: string; roleName?: string },
    dto: CrearReservaDto,
  ): Promise<BoletaReservaResponseDto> {
    const role = user.roleName || user.role;
    const userId = user.userId || user.id;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado o ID no identificado');
    }

    // Regla 1: Solo roles DRIVER y PARKING_OPERATOR pueden registrar boletas de reserva
    if (role !== 'DRIVER' && role !== 'PARKING_OPERATOR') {
      throw new ForbiddenException(
        'Solo los usuarios con rol Conductor (DRIVER) u Operador de Parqueo (PARKING_OPERATOR) pueden registrar reservas',
      );
    }

    // Determinar clienteId y operadorId
    let clienteId = userId;
    let operadorId: string | undefined = undefined;

    if (role === 'PARKING_OPERATOR') {
      operadorId = userId;
      if (!dto.clienteId) {
        throw new BadRequestException(
          'Para reservas registradas por un operador, debe especificarse el clienteId del conductor atendido',
        );
      }
      clienteId = dto.clienteId;
    }

    // Validar existencia del estacionamiento y catálogos de tarifas/extras
    const estacionamiento = await this.prisma.estacionamiento.findUnique({
      where: { id: dto.estacionamientoId },
      include: {
        tarifas: { where: { estado: 'ACTIVO' } },
        serviciosExtras: { where: { activo: true } },
      },
    });

    if (!estacionamiento) {
      throw new NotFoundException(
        `El estacionamiento con ID "${dto.estacionamientoId}" no existe`,
      );
    }

    // Si es operador, validar que pertenezca a este estacionamiento
    if (role === 'PARKING_OPERATOR') {
      const operadorUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { estacionamientoId: true },
      });
      if (operadorUser?.estacionamientoId !== dto.estacionamientoId) {
        throw new ForbiddenException(
          'No tienes permisos para registrar reservas en un estacionamiento distinto al tuyo asignado',
        );
      }
    }

    // Validar cliente
    const clienteUser = await this.prisma.user.findUnique({
      where: { id: clienteId },
      include: { role: true },
    });
    if (!clienteUser) {
      throw new NotFoundException(`El cliente con ID "${clienteId}" no existe`);
    }

    // Validar espacios e intervalos
    const ahora = new Date();
    const tarifaBaseHora =
      estacionamiento.tarifas.find((t) => t.modalidad === 'HORA')?.monto ?? 10;
    const tarifaId = estacionamiento.tarifas.find((t) => t.modalidad === 'HORA')?.id;

    const espaciosDb = await this.prisma.espacio.findMany({
      where: {
        id: { in: dto.espacios.map((e) => e.espacioId) },
        nivel: { estacionamientoId: dto.estacionamientoId },
      },
    });

    if (espaciosDb.length !== dto.espacios.length) {
      throw new BadRequestException(
        'Uno o más espacios no existen o no pertenecen a este estacionamiento',
      );
    }

    const espaciosMap = new Map(espaciosDb.map((e) => [e.id, e]));
    const extrasMap = new Map(
      estacionamiento.serviciosExtras.map((s) => [s.id, s]),
    );

    // Validaciones de fechas y armado de parámetros para Decorator
    const espaciosEnsamblaje: ParametrosEspacioEnsamblaje[] = [];
    const detallesPersistencia: Array<{
      espacioId: string;
      vehiculoId?: string;
      tarifaId?: string;
      inicioReserva: Date;
      finReserva: Date;
      precioUnitarioAplicado: number;
      subtotal: number;
      serviciosExtras?: Array<{
        servicioExtraId: string;
        cantidad: number;
        precioUnitarioAplicado: number;
        subtotal: number;
      }>;
    }> = [];

    for (const espDto of dto.espacios) {
      const espacioDb = espaciosMap.get(espDto.espacioId)!;
      const inicio = new Date(espDto.inicioReserva);
      const fin = new Date(espDto.finReserva);

      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        throw new BadRequestException(
          `Fechas inválidas para el espacio "${espacioDb.codigoEspacio}"`,
        );
      }

      if (inicio >= fin) {
        throw new BadRequestException(
          `La fecha de inicio debe ser anterior a la fecha de fin en el espacio "${espacioDb.codigoEspacio}"`,
        );
      }

      // Duración en horas con fracción
      const duracionMs = fin.getTime() - inicio.getTime();
      const duracionHoras = Math.max(0.5, Math.ceil((duracionMs / (1000 * 60 * 60)) * 10) / 10);

      // Chequeo de colisión en intervalo [inicio, fin) para este espacio
      const colisiones = await this.reservaRepo.verificarColisionEspacios(
        [espacioDb.id],
        inicio,
        fin,
      );

      if (colisiones.length > 0) {
        throw new ConflictException(
          `El espacio "${espacioDb.codigoEspacio}" ya se encuentra reservado en el horario solicitado (conflicto con reserva ${colisiones[0].conflictoCon})`,
        );
      }

      // Validar extras de este espacio
      const extrasValidados = (espDto.serviciosExtras || []).map((extDto) => {
        const extraDb = extrasMap.get(extDto.servicioExtraId);
        if (!extraDb) {
          throw new BadRequestException(
            `El servicio extra "${extDto.servicioExtraId}" no está disponible o activo en este parqueo`,
          );
        }
        return {
          servicioExtraId: extraDb.id,
          nombre: extraDb.nombre,
          precioUnitario: extraDb.precio,
          cantidad: extDto.cantidad ?? 1,
        };
      });

      espaciosEnsamblaje.push({
        espacioId: espacioDb.id,
        codigoEspacio: espacioDb.codigoEspacio,
        precioBaseUnitario: tarifaBaseHora,
        duracionHoras,
        extras: extrasValidados,
      });
    }

    // Cálculo centralizado con el patrón Decorator (GoF)
    const desgloseBoleta = ReservaPriceAssembler.calcularBoleta(espaciosEnsamblaje);

    // Preparar snapshots históricos para la persistencia
    for (let i = 0; i < dto.espacios.length; i++) {
      const espDto = dto.espacios[i];
      const desgloseEsp = desgloseBoleta.detallesEspacios[i];

      detallesPersistencia.push({
        espacioId: espDto.espacioId,
        vehiculoId: espDto.vehiculoId,
        tarifaId,
        inicioReserva: new Date(espDto.inicioReserva),
        finReserva: new Date(espDto.finReserva),
        precioUnitarioAplicado: desgloseEsp.precioBaseUnitario,
        subtotal: desgloseEsp.subtotalTotalEspacio,
        serviciosExtras: desgloseEsp.serviciosExtras.map((ext) => ({
          servicioExtraId: ext.servicioExtraId,
          cantidad: ext.cantidad,
          precioUnitarioAplicado: ext.precioUnitario,
          subtotal: ext.subtotal,
        })),
      });
    }

    // Generar código de reserva y QR token
    const añoActual = ahora.getFullYear();
    const correlativo = Math.floor(1000 + Math.random() * 9000);
    const codigoReserva = `TKT-${añoActual}-${correlativo}`;
    const qrToken = `PARKINGO:RES:${codigoReserva}:${clienteId}:${dto.estacionamientoId}`;

    // Persistir de manera atómica
    const reservacionCreada = await this.reservaRepo.create({
      codigoReserva,
      qrToken,
      total: desgloseBoleta.totalGeneral,
      modalidad: dto.modalidad ?? 'HORA',
      estacionamientoId: dto.estacionamientoId,
      clienteId,
      operadorId,
      detalles: detallesPersistencia,
    });

    return ReservaMapper.toDto(reservacionCreada);
  }
}
