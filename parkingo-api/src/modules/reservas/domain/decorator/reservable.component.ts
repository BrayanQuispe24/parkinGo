export interface DesgloseServicioExtraDto {
  servicioExtraId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface DesgloseEspacioDto {
  espacioId: string;
  codigoEspacio: string;
  precioBaseUnitario: number;
  duracionHoras: number;
  subtotalBaseEspacio: number;
  serviciosExtras: DesgloseServicioExtraDto[];
  subtotalTotalEspacio: number;
}

export interface DesgloseBoletaDto {
  detallesEspacios: DesgloseEspacioDto[];
  totalGeneral: number;
}

/**
 * Contrato Component (GoF Decorator Pattern)
 * Define la interfaz uniforme que cumplen tanto el espacio base como los envoltorios de servicios extras.
 */
export interface ReservableComponent {
  /**
   * Calcula recursivamente el precio acumulado de este elemento y sus decoradores.
   */
  calcularPrecio(): number;

  /**
   * Retorna la estructura detallada con snapshots de tarifas del espacio y sus extras asociados.
   */
  obtenerDesglose(): DesgloseEspacioDto;
}
