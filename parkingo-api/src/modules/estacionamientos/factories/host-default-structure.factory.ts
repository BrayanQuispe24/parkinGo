import { Injectable } from '@nestjs/common';
import { TipoEspacio, ModalidadTarifa, EstadoEspacio } from '@prisma/client';

export interface DefaultHostStructure {
  nivel: {
    codigo: string;
  };
  espacio: {
    codigoEspacio: string;
    tipo: TipoEspacio;
    modalidad: ModalidadTarifa;
    estado: EstadoEspacio;
  };
  croquis: {
    codigo: string;
    anchoLienzo: number;
    altoLienzo: number;
    fondoTipo: string;
    fondoOpacidad: number;
    generarContenido: (espacioId: string, codigoEspacio: string) => Record<string, unknown>;
  };
}

@Injectable()
export class HostDefaultStructureFactory {
  createDefaultStructure(): DefaultHostStructure {
    return {
      nivel: {
        codigo: 'PLANTA-BAJA',
      },
      espacio: {
        codigoEspacio: 'BOX-1',
        tipo: TipoEspacio.AUTO,
        modalidad: ModalidadTarifa.HORA,
        estado: EstadoEspacio.DISPONIBLE,
      },
      croquis: {
        codigo: 'PLANO-PRINCIPAL',
        anchoLienzo: 1200,
        altoLienzo: 800,
        fondoTipo: 'CONCRETO',
        fondoOpacidad: 0.85,
        generarContenido: (espacioId: string, codigoEspacio: string) => ({
          anchoLienzo: 1200,
          altoLienzo: 800,
          nodos: [
            // Plaza única de parqueo residencial (Box 1)
            {
              id: espacioId,
              tipo: 'ESPACIO',
              espacioId,
              codigoEspacio,
              x: 540,
              y: 280,
              width: 80,
              height: 140,
              rotation: 0,
              tipoVehiculo: TipoEspacio.AUTO,
              estado: EstadoEspacio.DISPONIBLE,
            },
            // Portón de entrada vehicular al garaje
            {
              id: 'entrada-porton-1',
              tipo: 'ENTRADA',
              subtipoEntrada: 'VEHICULAR',
              x: 520,
              y: 500,
              width: 120,
              height: 35,
              rotation: 0,
              nombre: 'Portón Principal',
              conBarrera: false,
            },
            // Muro lateral izquierdo de la cochera
            {
              id: 'muro-izq-1',
              tipo: 'MURO',
              x: 420,
              y: 200,
              width: 20,
              height: 300,
              rotation: 0,
            },
            // Muro lateral derecho de la cochera
            {
              id: 'muro-der-1',
              tipo: 'MURO',
              x: 720,
              y: 200,
              width: 20,
              height: 300,
              rotation: 0,
            },
            // Muro posterior (fondo de la cochera)
            {
              id: 'muro-fondo-1',
              tipo: 'MURO',
              x: 420,
              y: 190,
              width: 320,
              height: 20,
              rotation: 0,
            },
            // Flecha indicadora de acceso hacia la plaza
            {
              id: 'flecha-acceso-1',
              tipo: 'FLECHA',
              x: 580,
              y: 470,
              points: [0, 0, 0, -50],
              rotation: 0,
            },
          ],
        }),
      },
    };
  }
}
