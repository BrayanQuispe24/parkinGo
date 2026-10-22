import { OperadorWithRole } from '../repositories/estacionamiento-operador.repository.js';
import { OperadorEstacionamientoResponseDto } from '../dto/operador-estacionamiento-response.dto.js';

export class EstacionamientoOperadorMapper {
  static toResponseDto(operador: OperadorWithRole): OperadorEstacionamientoResponseDto {
    return {
      id: operador.id,
      email: operador.email,
      firstName: operador.firstName,
      lastName: operador.lastName,
      nombreCompleto: `${operador.firstName} ${operador.lastName}`.trim(),
      ci: operador.ci,
      phone: operador.phone,
      photoUrl: operador.photoUrl,
      status: operador.status,
      estacionamientoId: operador.estacionamientoId,
      roleName: operador.role?.name || 'PARKING_OPERATOR',
      createdAt: operador.createdAt.toISOString(),
    };
  }

  static toResponseDtoList(operadores: OperadorWithRole[]): OperadorEstacionamientoResponseDto[] {
    return operadores.map((op) => this.toResponseDto(op));
  }
}
