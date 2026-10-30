// src/modules/driver/infrastructure/mappers/DriverParkingMapper.ts
import type { DriverParking } from '../../domain/DriverParking';
import imgEmpresarial from '../../../../assets/parking_empresarial_1789393502203.png';

export interface CatalogoEstacionamientoApiDto {
    id: string;
    nombre: string;
    direccion: string;
    zona: string;
    latitud: number;
    longitud: number;
    precioHora: number;
    totalEspacios: number;
    espaciosDisponibles: number;
    fotoPrincipal: string | null;
    fotos: string[];
    tags: string[];
    horarios: Array<{ dia: string; horaInicio: string; horaCierre: string }>;
    tarifas: Array<{ id: string; descripcion: string; monto: number; modalidad: string }>;
    serviciosExtras: Array<{ id: string; nombre: string; precio: number; descripcion?: string | null }>;
    espacios?: Array<{
        id: string;
        codigoEspacio: string;
        tipo: string;
        nivel: string;
        nivelId?: string;
        estado: string;
    }>;
    tenantId: string;
}

export class DriverParkingMapper {
    private static readonly API_BASE = 'http://localhost:3000';

    static toDomain(dto: CatalogoEstacionamientoApiDto, index: number = 0): DriverParking {
        // Resolver URL absoluta de la fotografía
        let photoUrl = imgEmpresarial;
        if (dto.fotoPrincipal) {
            photoUrl = dto.fotoPrincipal.startsWith('http')
                ? dto.fotoPrincipal
                : `${this.API_BASE}${dto.fotoPrincipal}`;
        } else if (dto.fotos && dto.fotos.length > 0) {
            photoUrl = dto.fotos[0].startsWith('http')
                ? dto.fotos[0]
                : `${this.API_BASE}${dto.fotos[0]}`;
        }

        // Sanitizar tags permitidos para la capa de presentación
        const validTags: ('ev' | 'cubierto' | 'seguridad')[] = [];
        if (dto.tags && Array.isArray(dto.tags)) {
            for (const t of dto.tags) {
                const lower = t.toLowerCase();
                if (lower === 'ev' && !validTags.includes('ev')) validTags.push('ev');
                if (lower === 'cubierto' && !validTags.includes('cubierto')) validTags.push('cubierto');
                if (lower === 'seguridad' && !validTags.includes('seguridad')) validTags.push('seguridad');
            }
        }
        if (validTags.length === 0) {
            validTags.push('seguridad');
        }

        // Cálculo de posición en mapa estilizado (porcentaje en lienzo relativo)
        const topOffsets = [42, 58, 35, 65, 28, 50];
        const leftOffsets = [52, 72, 32, 45, 68, 40];
        const topPercent = topOffsets[index % topOffsets.length];
        const leftPercent = leftOffsets[index % leftOffsets.length];

        return {
            id: dto.id,
            name: dto.nombre,
            address: dto.direccion,
            zone: dto.zona || 'Santa Cruz',
            pricePerHour: dto.precioHora > 0 ? dto.precioHora : 10,
            totalSpots: dto.totalEspacios > 0 ? dto.totalEspacios : 30,
            availableSpots: dto.totalEspacios > 0 ? dto.espaciosDisponibles : 12,
            photoUrl,
            tags: validTags,
            latitude:
                typeof dto.latitud === 'number' && !isNaN(dto.latitud) && dto.latitud !== 0
                    ? dto.latitud
                    : parseFloat(String(dto.latitud)) || -17.7682,
            longitude:
                typeof dto.longitud === 'number' && !isNaN(dto.longitud) && dto.longitud !== 0
                    ? dto.longitud
                    : parseFloat(String(dto.longitud)) || -63.1834,
            mapPosition: {
                topPercent,
                leftPercent,
            },
            distanceKm: Number((0.5 + (index * 0.4)).toFixed(1)),
            estimatedMinutes: 2 + (index * 2),
            isFavorite: false,
            fotos: (dto.fotos || []).map((f) => (f.startsWith('http') ? f : `${this.API_BASE}${f}`)),
            horarios: dto.horarios,
            tarifas: dto.tarifas,
            serviciosExtras: dto.serviciosExtras,
            spaces: (dto.espacios || []).map((e) => ({
                id: e.id,
                code: e.codigoEspacio,
                type: e.tipo,
                level: e.nivel,
                levelId: e.nivelId,
                status: e.estado,
            })),
        };
    }

    static toDomainList(list: CatalogoEstacionamientoApiDto[]): DriverParking[] {
        if (!Array.isArray(list)) return [];
        return list.map((dto, index) => this.toDomain(dto, index));
    }
}
