import { describe, it, expect } from 'vitest';
import { EspacioReservadoComponent } from '../../src/modules/reservas/domain/decorator/espacio-reservado.component.js';
import { ServicioExtraDecorator } from '../../src/modules/reservas/domain/decorator/servicio-extra.decorator.js';
import { ReservaPriceAssembler } from '../../src/modules/reservas/domain/decorator/reserva-price.assembler.js';

describe('Patrón Decorator (GoF) - Motor de Precios de Boleta de Reserva', () => {
  it('RF05/T01: Un espacio sin servicios extras devuelve exactamente su tarifa base', () => {
    // 2 horas a 10 Bs/hora = 20 Bs
    const espacio = new EspacioReservadoComponent('esp-1', 'A-01', 10, 2);

    expect(espacio.calcularPrecio()).toBe(20);

    const desglose = espacio.obtenerDesglose();
    expect(desglose.subtotalBaseEspacio).toBe(20);
    expect(desglose.serviciosExtras).toHaveLength(0);
    expect(desglose.subtotalTotalEspacio).toBe(20);
  });

  it('RF05/T02: Un espacio con múltiples extras dinámicos calcula aditivamente sin duplicaciones', () => {
    // Espacio base: 2 horas a 10 Bs = 20 Bs
    const espacioBase = new EspacioReservadoComponent('esp-1', 'A-01', 10, 2);

    // Decorador 1: Lavado (15 Bs)
    const conLavado = new ServicioExtraDecorator(
      espacioBase,
      'srv-1',
      'Lavado Exterior',
      15,
      1,
    );
    expect(conLavado.calcularPrecio()).toBe(35);

    // Decorador 2: Aspirado (10 Bs)
    const conLavadoYAspirado = new ServicioExtraDecorator(
      conLavado,
      'srv-2',
      'Aspirado Interior',
      10,
      1,
    );
    expect(conLavadoYAspirado.calcularPrecio()).toBe(45);

    const desglose = conLavadoYAspirado.obtenerDesglose();
    expect(desglose.subtotalBaseEspacio).toBe(20);
    expect(desglose.serviciosExtras).toHaveLength(2);
    expect(desglose.serviciosExtras[0].nombre).toBe('Lavado Exterior');
    expect(desglose.serviciosExtras[0].subtotal).toBe(15);
    expect(desglose.serviciosExtras[1].nombre).toBe('Aspirado Interior');
    expect(desglose.serviciosExtras[1].subtotal).toBe(10);
    expect(desglose.subtotalTotalEspacio).toBe(45);
  });

  it('RF05/T03: Escenario exacto del prompt (3 espacios con diferentes servicios extras suma exactamente 118 Bs)', () => {
    /**
     * Boleta BR-001
     *   Detalle A: Espacio A    20 Bs
     *       Servicio lavado     15 Bs
     *       Servicio aspirado   10 Bs
     *       Subtotal            45 Bs
     *   Detalle B: Espacio B    30 Bs
     *       Servicio carga      25 Bs
     *       Subtotal            55 Bs
     *   Detalle C: Espacio C    18 Bs
     *       (sin extras)
     *       Subtotal            18 Bs
     *   TOTAL                 118 Bs
     */
    const espaciosInput = [
      {
        espacioId: 'esp-A',
        codigoEspacio: 'Espacio A',
        precioBaseUnitario: 20,
        duracionHoras: 1,
        extras: [
          { servicioExtraId: 'srv-lav', nombre: 'Servicio lavado', precioUnitario: 15, cantidad: 1 },
          { servicioExtraId: 'srv-asp', nombre: 'Servicio aspirado', precioUnitario: 10, cantidad: 1 },
        ],
      },
      {
        espacioId: 'esp-B',
        codigoEspacio: 'Espacio B',
        precioBaseUnitario: 30,
        duracionHoras: 1,
        extras: [
          { servicioExtraId: 'srv-car', nombre: 'Servicio carga', precioUnitario: 25, cantidad: 1 },
        ],
      },
      {
        espacioId: 'esp-C',
        codigoEspacio: 'Espacio C',
        precioBaseUnitario: 18,
        duracionHoras: 1,
        extras: [],
      },
    ];

    const boleta = ReservaPriceAssembler.calcularBoleta(espaciosInput);

    expect(boleta.detallesEspacios).toHaveLength(3);
    expect(boleta.detallesEspacios[0].subtotalTotalEspacio).toBe(45);
    expect(boleta.detallesEspacios[1].subtotalTotalEspacio).toBe(55);
    expect(boleta.detallesEspacios[2].subtotalTotalEspacio).toBe(18);
    expect(boleta.totalGeneral).toBe(118);
  });

  it('RF02/T04: Soporta servicios dinámicos configurables de BD sin crear subclases TypeScript', () => {
    const espacioBase = new EspacioReservadoComponent('esp-1', 'B-10', 12, 1);

    // Servicio nuevo creado dinámicamente por un operador: "Pulido Cerámico Premium" a 85.50 Bs
    const nuevoServicioBD = new ServicioExtraDecorator(
      espacioBase,
      'srv-nuevo-99',
      'Pulido Cerámico Premium',
      85.5,
      1,
    );

    expect(nuevoServicioBD.calcularPrecio()).toBe(97.5);
    expect(nuevoServicioBD.obtenerDesglose().serviciosExtras[0].nombre).toBe('Pulido Cerámico Premium');
  });

  it('RF04: Aislamiento estricto: los servicios del Espacio A no se asignan por accidente al Espacio B', () => {
    const espacioA = ReservaPriceAssembler.ensamblarEspacio({
      espacioId: 'A',
      codigoEspacio: 'A-01',
      precioBaseUnitario: 10,
      duracionHoras: 1,
      extras: [{ servicioExtraId: 'e-1', nombre: 'Extra Solo de A', precioUnitario: 5, cantidad: 1 }],
    });

    const espacioB = ReservaPriceAssembler.ensamblarEspacio({
      espacioId: 'B',
      codigoEspacio: 'B-01',
      precioBaseUnitario: 10,
      duracionHoras: 1,
      extras: [],
    });

    expect(espacioA.obtenerDesglose().serviciosExtras).toHaveLength(1);
    expect(espacioB.obtenerDesglose().serviciosExtras).toHaveLength(0);
    expect(espacioA.calcularPrecio()).toBe(15);
    expect(espacioB.calcularPrecio()).toBe(10);
  });

  it('RF09: Rechaza tarifas negativas o duraciones inválidas', () => {
    expect(() => new EspacioReservadoComponent('esp-1', 'A-01', -5, 1)).toThrow();
    expect(() => new EspacioReservadoComponent('esp-1', 'A-01', 10, 0)).toThrow();

    const espacioValido = new EspacioReservadoComponent('esp-1', 'A-01', 10, 1);
    expect(() => new ServicioExtraDecorator(espacioValido, 's-1', 'Extra', -10, 1)).toThrow();
    expect(() => new ServicioExtraDecorator(espacioValido, 's-1', 'Extra', 10, 0)).toThrow();
  });
});
