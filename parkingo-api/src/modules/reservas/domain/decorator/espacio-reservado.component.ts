import {
  ReservableComponent,
  DesgloseEspacioDto,
} from './reservable.component.js';

/**
 * ConcreteComponent (GoF Decorator Pattern)
 * Representa el espacio de parqueo seleccionado en su intervalo temporal con su tarifa base.
 */
export class EspacioReservadoComponent implements ReservableComponent {
  private readonly precioBaseCalculado: number;

  constructor(
    public readonly espacioId: string,
    public readonly codigoEspacio: string,
    public readonly precioBaseUnitario: number,
    public readonly duracionHoras: number,
  ) {
    if (precioBaseUnitario < 0) {
      throw new Error(`La tarifa base no puede ser negativa (${precioBaseUnitario})`);
    }
    if (duracionHoras <= 0) {
      throw new Error(`La duración de la reserva debe ser mayor a 0 horas (${duracionHoras})`);
    }
    // Redondeo explícito a 2 decimales para precisión monetaria
    this.precioBaseCalculado = Math.round(precioBaseUnitario * duracionHoras * 100) / 100;
  }

  calcularPrecio(): number {
    return this.precioBaseCalculado;
  }

  obtenerDesglose(): DesgloseEspacioDto {
    return {
      espacioId: this.espacioId,
      codigoEspacio: this.codigoEspacio,
      precioBaseUnitario: this.precioBaseUnitario,
      duracionHoras: this.duracionHoras,
      subtotalBaseEspacio: this.precioBaseCalculado,
      serviciosExtras: [],
      subtotalTotalEspacio: this.precioBaseCalculado,
    };
  }
}
