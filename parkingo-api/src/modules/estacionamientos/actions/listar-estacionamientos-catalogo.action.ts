import { Injectable } from '@nestjs/common';
import { EstacionamientoRepository, EstacionamientoCatalogoRecord } from '../repositories/estacionamiento.repository.js';
import { CatalogoEstacionamientoResponseDto } from '../dto/catalogo-estacionamiento-response.dto.js';

@Injectable()
export class ListarEstacionamientosCatalogoAction {
  constructor(private readonly estacionamientoRepository: EstacionamientoRepository) {}

  async execute(): Promise<CatalogoEstacionamientoResponseDto[]> {
    const records = await this.estacionamientoRepository.findCatalogo();
    return records.map((record) => this.mapToCatalogoDto(record));
  }

  private mapToCatalogoDto(record: EstacionamientoCatalogoRecord): CatalogoEstacionamientoResponseDto {
    // 1. Calcular total de espacios y disponibles
    let totalEspacios = 0;
    let espaciosDisponibles = 0;
    let tieneEspacioElectrico = false;

    if (record.niveles) {
      for (const nivel of record.niveles) {
        if (nivel.espacios) {
          totalEspacios += nivel.espacios.length;
          for (const espacio of nivel.espacios) {
            if (espacio.estado === 'DISPONIBLE') {
              espaciosDisponibles += 1;
            }
            if (espacio.tipo === 'ELECTRICO') {
              tieneEspacioElectrico = true;
            }
          }
        }
      }
    }

    // 2. Determinar precio por hora representativo
    let precioHora = 0;
    if (record.tarifas && record.tarifas.length > 0) {
      const tarifaHora = record.tarifas.find((t) => t.modalidad === 'HORA');
      if (tarifaHora) {
        precioHora = tarifaHora.monto;
      } else {
        precioHora = record.tarifas[0].monto;
      }
    }

    // 3. Determinar tags para filtros
    const tags: string[] = ['seguridad']; // Seguridad 24/7 por defecto para parqueos registrados
    const serviciosNombres = (record.serviciosExtras || []).map((s) => s.nombre.toLowerCase());

    if (
      tieneEspacioElectrico ||
      serviciosNombres.some((s) => s.includes('elect') || s.includes('ev') || s.includes('carga'))
    ) {
      tags.push('ev');
    }

    if (
      record.nombre.toLowerCase().includes('tech') ||
      record.direccion.toLowerCase().includes('tech') ||
      serviciosNombres.some((s) => s.includes('cubiert') || s.includes('techad')) ||
      (record.niveles && record.niveles.length > 1) // Edificios multinivel son techados
    ) {
      tags.push('cubierto');
    }

    // 4. Fotos
    const fotos = (record.fotos || []).map((f) => f.url);
    const fotoPrincipal = fotos.length > 0 ? fotos[0] : null;

    // 5. Horarios
    const horarios = (record.horarios || []).map((eh) => ({
      dia: eh.horario.dia,
      horaInicio: eh.horario.horaInicio,
      horaCierre: eh.horario.horaCierre,
    }));

    // 6. Tarifas
    const tarifas = (record.tarifas || []).map((t) => ({
      id: t.id,
      descripcion: t.descripcion,
      monto: t.monto,
      modalidad: t.modalidad,
    }));

    // 7. Servicios extras
    const serviciosExtras = (record.serviciosExtras || []).map((s) => ({
      id: s.id,
      nombre: s.nombre,
      descripcion: s.descripcion,
      precio: s.precio,
    }));

    // 8. Espacios / Plazas
    const espacios = (record.niveles || []).flatMap((nivel) =>
      (nivel.espacios || []).map((espacio) => ({
        id: espacio.id,
        codigoEspacio: espacio.codigoEspacio,
        tipo: espacio.tipo,
        nivel: nivel.codigo,
        nivelId: nivel.id,
        estado: espacio.estado,
      })),
    );

    const zona = record.tenant?.ciudad || record.direccion || 'Santa Cruz';

    return {
      id: record.id,
      nombre: record.nombre,
      direccion: record.direccion,
      zona,
      latitud: record.latitud,
      longitud: record.longitud,
      precioHora,
      totalEspacios,
      espaciosDisponibles,
      fotoPrincipal,
      fotos,
      tags,
      horarios,
      tarifas,
      serviciosExtras,
      espacios,
      tenantId: record.tenantId,
    };
  }
}
