import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import {
  CotizarReservaDto,
} from '../dto/cotizar-reserva.dto.js';
import { CotizacionReservaResponseDto } from '../dto/reserva-response.dto.js';
import {
  ReservaPriceAssembler,
  ParametrosEspacioEnsamblaje,
} from '../domain/decorator/reserva-price.assembler.js';

@Injectable()
export class CotizarReservaAction {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CotizarReservaDto): Promise<CotizacionReservaResponseDto> {
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

    // Tarifa base estándar por hora (usar tarifa vigente de estacionamiento o default 10)
    const tarifaBaseHora =
      estacionamiento.tarifas.find((t) => t.modalidad === 'HORA')?.monto ?? 10;

    // Obtener información de los espacios solicitados
    const espaciosIds = dto.espacios.map((e) => e.espacioId);
    const espaciosDb = await this.prisma.espacio.findMany({
      where: {
        id: { in: espaciosIds },
        nivel: { estacionamientoId: dto.estacionamientoId },
      },
    });

    if (espaciosDb.length !== espaciosIds.length) {
      throw new BadRequestException(
        'Uno o más espacios seleccionados no pertenecen a este estacionamiento o no existen',
      );
    }

    const espaciosMap = new Map(espaciosDb.map((e) => [e.id, e]));
    const extrasMap = new Map(
      estacionamiento.serviciosExtras.map((s) => [s.id, s]),
    );

    // Preparar parámetros para el motor del patrón Decorator
    const espaciosEnsamblaje: ParametrosEspacioEnsamblaje[] = dto.espacios.map(
      (espDto) => {
        const espacioDb = espaciosMap.get(espDto.espacioId)!;

        const extrasValidados = (espDto.serviciosExtras || []).map((extDto) => {
          const extraDb = extrasMap.get(extDto.servicioExtraId);
          if (!extraDb) {
            throw new BadRequestException(
              `El servicio extra "${extDto.servicioExtraId}" no está disponible en este estacionamiento`,
            );
          }
          return {
            servicioExtraId: extraDb.id,
            nombre: extraDb.nombre,
            precioUnitario: extraDb.precio,
            cantidad: extDto.cantidad ?? 1,
          };
        });

        return {
          espacioId: espacioDb.id,
          codigoEspacio: espacioDb.codigoEspacio,
          precioBaseUnitario: tarifaBaseHora,
          duracionHoras: espDto.duracionHoras,
          extras: extrasValidados,
        };
      },
    );

    // Ejecutar cálculo mediante el patrón Decorator
    const calculo = ReservaPriceAssembler.calcularBoleta(espaciosEnsamblaje);

    return {
      estacionamientoNombre: estacionamiento.nombre,
      detallesEspacios: calculo.detallesEspacios,
      totalGeneral: calculo.totalGeneral,
    };
  }
}
