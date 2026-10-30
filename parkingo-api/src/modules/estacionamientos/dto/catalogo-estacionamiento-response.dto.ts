import { ApiProperty } from '@nestjs/swagger';
import { DiaSemana } from '@prisma/client';

export class HorarioAtencionDto {
  @ApiProperty({ enum: DiaSemana, example: DiaSemana.LUNES })
  dia: DiaSemana;

  @ApiProperty({ example: '08:00' })
  horaInicio: string;

  @ApiProperty({ example: '22:00' })
  horaCierre: string;
}

export class ServicioExtraCatalogoDto {
  @ApiProperty({ example: 'c1d2e3f4-5678-90ab-cdef-1234567890ab' })
  id: string;

  @ApiProperty({ example: 'Lavado Ecológico' })
  nombre: string;

  @ApiProperty({ example: 'Lavado con cera y aspirado interior', nullable: true })
  descripcion: string | null;

  @ApiProperty({ example: 25.5 })
  precio: number;
}

export class TarifaCatalogoDto {
  @ApiProperty({ example: 'd2e3f4g5-6789-01bc-def2-2345678901bc' })
  id: string;

  @ApiProperty({ example: 'Tarifa general diurna' })
  descripcion: string;

  @ApiProperty({ example: 10.0 })
  monto: number;

  @ApiProperty({ example: 'HORA' })
  modalidad: string;
}

export class EspacioCatalogoDto {
  @ApiProperty({ example: '4650a72e-4353-4bd2-b2e0-6632e0fa0a7a' })
  id: string;

  @ApiProperty({ example: '1B-1' })
  codigoEspacio: string;

  @ApiProperty({ example: 'AUTO' })
  tipo: string;

  @ApiProperty({ example: 'Nivel 1B' })
  nivel: string;

  @ApiProperty({ example: 'n1v3l-1d-1234' })
  nivelId: string;

  @ApiProperty({ example: 'DISPONIBLE' })
  estado: string;
}

export class CatalogoEstacionamientoResponseDto {
  @ApiProperty({ example: 'f3e2d1c0-b9a8-7654-3210-fedcba987654' })
  id: string;

  @ApiProperty({ example: 'ParkinGo Central Equipetrol' })
  nombre: string;

  @ApiProperty({ example: 'Av. San Martín #450, Equipetrol Norte' })
  direccion: string;

  @ApiProperty({ example: 'Equipetrol Norte' })
  zona: string;

  @ApiProperty({ example: -17.7682 })
  latitud: number;

  @ApiProperty({ example: -63.1834 })
  longitud: number;

  @ApiProperty({ example: 10.0, description: 'Tarifa por hora base para vehículos' })
  precioHora: number;

  @ApiProperty({ example: 60, description: 'Total de plazas registradas' })
  totalEspacios: number;

  @ApiProperty({ example: 42, description: 'Total de plazas libres actualmente' })
  espaciosDisponibles: number;

  @ApiProperty({ example: '/uploads/estacionamientos/foto_123.jpg', nullable: true })
  fotoPrincipal: string | null;

  @ApiProperty({ type: [String], example: ['/uploads/estacionamientos/foto_1.jpg'] })
  fotos: string[];

  @ApiProperty({
    type: [String],
    example: ['ev', 'cubierto', 'seguridad'],
    description: 'Etiquetas de servicios: ev (Carga EV), cubierto (Techado), seguridad (Vigilancia 24/7)',
  })
  tags: string[];

  @ApiProperty({ type: [HorarioAtencionDto] })
  horarios: HorarioAtencionDto[];

  @ApiProperty({ type: [TarifaCatalogoDto] })
  tarifas: TarifaCatalogoDto[];

  @ApiProperty({ type: [ServicioExtraCatalogoDto] })
  serviciosExtras: ServicioExtraCatalogoDto[];

  @ApiProperty({ type: [EspacioCatalogoDto], description: 'Listado de plazas/espacios del parqueo' })
  espacios: EspacioCatalogoDto[];

  @ApiProperty({ example: 'tenant-uuid-1234' })
  tenantId: string;
}
