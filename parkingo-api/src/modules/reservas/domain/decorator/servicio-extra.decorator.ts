import {
  ReservableComponent,
  DesgloseEspacioDto,
  DesgloseServicioExtraDto,
} from './reservable.component.js';

/**
 * Decorator Genérico Concreto (GoF Decorator Pattern)
 * Añade la tarifa y cantidad de un servicio extra configurable sin necesidad de crear subclases.
 */
export class ServicioExtraDecorator implements ReservableComponent {
  private readonly subtotalServicio: number;

  constructor(
    private readonly componente: ReservableComponent,
    public readonly servicioExtraId: string,
    public readonly nombre: string,
    public readonly precioUnitario: number,
    public readonly cantidad: number = 1,
  ) {
    if (!componente) {
      throw new Error('El decorador requiere un componente Reservable interior válido');
    }
    if (precioUnitario < 0) {
      throw new Error(`El precio del servicio extra "${nombre}" no puede ser negativo (${precioUnitario})`);
    }
    if (cantidad <= 0) {
      throw new Error(`La cantidad contratada para "${nombre}" debe ser al menos 1 (${cantidad})`);
    }

    this.subtotalServicio = Math.round(precioUnitario * cantidad * 100) / 100;
  }

  /**
   * Cálculo delegativo recursivo:
   * Delegar al componente anterior y sumar el subtotal del servicio extra.
   */
  calcularPrecio(): number {
    const precioAcumulado = this.componente.calcularPrecio() + this.subtotalServicio;
    return Math.round(precioAcumulado * 100) / 100;
  }

  /**
   * Construye el desglose acumulativo extendiendo la lista de extras del espacio.
   */
  obtenerDesglose(): DesgloseEspacioDto {
    const desgloseBase = this.componente.obtenerDesglose();

    const nuevoExtra: DesgloseServicioExtraDto = {
      servicioExtraId: this.servicioExtraId,
      nombre: this.nombre,
      precioUnitario: this.precioUnitario,
      cantidad: this.cantidad,
      subtotal: this.subtotalServicio,
    };

    const extrasActualizados = [...desgloseBase.serviciosExtras, nuevoExtra];
    const nuevoTotal = this.calcularPrecio();

    return {
      ...desgloseBase,
      serviciosExtras: extrasActualizados,
      subtotalTotalEspacio: nuevoTotal,
    };
  }
}
