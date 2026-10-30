import {
  ReservableComponent,
  DesgloseBoletaDto,
  DesgloseEspacioDto,
} from './reservable.component.js';
import { EspacioReservadoComponent } from './espacio-reservado.component.js';
import { ServicioExtraDecorator } from './servicio-extra.decorator.js';

export interface ParametrosExtraEnsamblaje {
  servicioExtraId: string;
  nombre: string;
  precioUnitario: number;
  cantidad?: number;
}

export interface ParametrosEspacioEnsamblaje {
  espacioId: string;
  codigoEspacio: string;
  precioBaseUnitario: number;
  duracionHoras: number;
  extras?: ParametrosExtraEnsamblaje[];
}

/**
 * Assembler del patrón Decorator (GoF)
 * Ensambla de forma modular las cadenas decoradoras por cada espacio y calcula el total de la boleta.
 */
export class ReservaPriceAssembler {
  /**
   * Ensambla la cadena decoradora para un único espacio y sus extras seleccionados.
   */
  static ensamblarEspacio(
    params: ParametrosEspacioEnsamblaje,
  ): ReservableComponent {
    let actual: ReservableComponent = new EspacioReservadoComponent(
      params.espacioId,
      params.codigoEspacio,
      params.precioBaseUnitario,
      params.duracionHoras,
    );

    if (params.extras && params.extras.length > 0) {
      for (const extra of params.extras) {
        actual = new ServicioExtraDecorator(
          actual,
          extra.servicioExtraId,
          extra.nombre,
          extra.precioUnitario,
          extra.cantidad ?? 1,
        );
      }
    }

    return actual;
  }

  /**
   * Calcula el desglose y total completo de una boleta compuesta por 1 o más espacios decorados.
   */
  static calcularBoleta(
    espacios: ParametrosEspacioEnsamblaje[],
  ): DesgloseBoletaDto {
    const desgloses: DesgloseEspacioDto[] = [];
    let totalGeneral = 0;

    for (const espacioParams of espacios) {
      const componenteDecorado = this.ensamblarEspacio(espacioParams);
      const desgloseEspacio = componenteDecorado.obtenerDesglose();
      desgloses.push(desgloseEspacio);
      totalGeneral += desgloseEspacio.subtotalTotalEspacio;
    }

    // Redondeo explícito a 2 decimales para total general
    totalGeneral = Math.round(totalGeneral * 100) / 100;

    return {
      detallesEspacios: desgloses,
      totalGeneral,
    };
  }
}
