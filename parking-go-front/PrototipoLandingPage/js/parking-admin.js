/* ==========================================================================
   PARKING ADMIN PANEL CONTROLLER (Vanilla JS)
   ParkinGo Enterprise Design System Alignment
   Exact Mapping to PostgreSQL 14+ DDL Database Schema (29 Tables)
   FULL CRUD ENGINE FOR TABLA 'tarifas'
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSidebarToggle();
  initCroquis();
  initTables();
  initTariffForm();
  initCharts();
  initClock();
  populateCasetaPlazaSelect();
  renderMovimientosTable();
  updateCasetaKPIs();
  console.log('✨ Parking Admin Controller Initialized - Terminal Operativa de Caseta (Entradas y Salidas)');
});

// Full PostgreSQL 14+ Relational Database State
const DB = {
  // Table 1: roles
  roles: [
    { id: 1, nombre: "Administrador General" },
    { id: 2, nombre: "Administrador de Parqueo" },
    { id: 3, nombre: "Operador de Parqueo" },
    { id: 4, nombre: "Conductor" }
  ],

  // Table 2: permisos
  permisos: [
    { id: 1, nombre: "gestionar_usuarios" },
    { id: 2, nombre: "revisar_solicitudes" },
    { id: 3, nombre: "gestionar_tarifas" },
    { id: 4, nombre: "registrar_entrada_salida" }
  ],

  // Table 3: permiso_role
  permiso_role: [
    { id: 1, permiso_id: 1, rol_id: 1 },
    { id: 2, permiso_id: 3, rol_id: 2 },
    { id: 3, permiso_id: 4, rol_id: 3 }
  ],

  // Table 4: usuarios
  usuarios: [
    { id: 10, correo_electronico: "juan.perez@parkingo.bo", contrasena: "$2b$12$eXaMpLeHaSh", verificacion: true, role_id: 2, estado: "activo" }
  ],

  // Table: operadores (Operadores del parqueo registrados por el administrador)
  operadores: [
    {
      id: 1,
      nombre: "Carlos Mendoza",
      ci: "7849120 SC",
      telefono: "+591 77123456",
      correo: "carlos.mendoza@parkingo.bo",
      garita: "Caseta Principal Norte",
      turno: "Turno Mañana (07:00 - 15:00)",
      estado: "en-sitio",
      fecha_registro: "2026-02-15"
    },
    {
      id: 2,
      nombre: "Roberto Gómez",
      ci: "6521908 LP",
      telefono: "+591 68987654",
      correo: "roberto.gomez@parkingo.bo",
      garita: "Caseta Acceso Sur",
      turno: "Turno Tarde (15:00 - 23:00)",
      estado: "activo",
      fecha_registro: "2026-03-01"
    },
    {
      id: 3,
      nombre: "Elena Torres",
      ci: "8912304 CB",
      telefono: "+591 71009988",
      correo: "elena.torres@parkingo.bo",
      garita: "Garita Nivel Subterráneo",
      turno: "Turno Noche (23:00 - 07:00)",
      estado: "activo",
      fecha_registro: "2026-04-10"
    }
  ],

  // Table 5: perfil
  perfil: [
    { id: 10, foto_url: null, nombre: "Juan", apellidos: "Pérez", sexo: "Masculino", fecha_nacimiento: "1988-05-14", telefono: "+591 700 12345", user_id: 10 }
  ],

  // Table 6: empresas
  empresas: [
    { id: 1, nombre: "Estacionamientos del Norte S.A.", nit: "1029384029", estado: "activo", usuario_id: 10 }
  ],

  // Table 7: liquidaciones_empresas
  liquidaciones_empresas: [
    { id: 1, fecha_inicio: "2026-08-01", fecha_fin: "2026-08-31", estado: "pendiente", empresa_id: 1 }
  ],

  // Table 8: clientes
  clientes: [
    { id: 102, nombre: "Lucía", apellidos: "Fernández", fecha_nacimiento: "1994-09-12", correo: "lucia.f@gmail.com", telefono: "+591 712 34567", contrasenia: "*****" },
    { id: 105, nombre: "Elena", apellidos: "Roca", fecha_nacimiento: "1991-03-22", correo: "elena.roca@hotmail.com", telefono: "+591 789 12345", contrasenia: "*****" },
    { id: 108, nombre: "Gabriel", apellidos: "Paz", fecha_nacimiento: "1987-11-05", correo: "gabriel.paz@tech.bo", telefono: "+591 765 43210", contrasenia: "*****" },
    { id: 110, nombre: "Empresa TechCorp", apellidos: "S.R.L.", fecha_nacimiento: "2015-01-01", correo: "admin@techcorp.bo", telefono: "+591 3 342 9900", contrasenia: "*****" },
    { id: 103, nombre: "Jorge", apellidos: "Valda", fecha_nacimiento: "1982-06-18", correo: "jorge.valda@gmail.com", telefono: "+591 701 99887", contrasenia: "*****" }
  ],

  // Table 9: vehiculos
  vehiculos: [
    { id: 301, tipo: "SUV", placa: "6543-BBB", modelo: "Hyundai Tucson", propietario_id: 102, color: "Blanco" },
    { id: 302, tipo: "SUV", placa: "7722-MMM", modelo: "Suzuki Vitara", propietario_id: 105, color: "Gris" },
    { id: 303, tipo: "EV", placa: "9911-EVX", modelo: "Tesla Model 3", propietario_id: 108, color: "Azul" },
    { id: 304, tipo: "VIP Techado", placa: "3344-VIP", modelo: "BMW X5", propietario_id: 110, color: "Negro" },
    { id: 305, tipo: "Sedan", placa: "7892-KLL", modelo: "Toyota Corolla", propietario_id: 102, color: "Gris" },
    { id: 306, tipo: "Sedan", placa: "4512-XYZ", modelo: "Nissan Sentra", propietario_id: 103, color: "Negro" },
    { id: 307, tipo: "Camioneta", placa: "8833-BBB", modelo: "Chevrolet Cruiser", propietario_id: 103, color: "Azul" }
  ],

  // Table 10: estacionamientos
  estacionamientos: [
    { id: 101, nombre: "ParkinGo Equipetrol", direccion: "Av. San Martín #450, Equipetrol, Santa Cruz", longitud: -63.182200, latitud: -17.783300, hora_apertura: "06:00:00", hora_cierre: "23:59:00", estado: "aprobado", empresa_id: 1 }
  ],

  // Table 11: asignacion_operadores
  asignacion_operadores: [
    { id: 1, user_id: 10, estacionamiento_id: 101, fecha_inicio: "2026-01-01T00:00:00Z", fecha_fin: null, estado: "activo" }
  ],

  // Table 12: fotos
  fotos: [
    { id: 1, url: "assets/parking_equipetrol_1.jpg", estacionamiento_id: 101 }
  ],

  // Table 13: niveles
  niveles: [
    { id: 1, codigo: "NIVEL-1", estacionamiento_id: 101 }
  ],

  // Table 14: croquis
  croquis: [
    { id: 1, codigo: "CROQUIS-P1", nivel_id: 1 }
  ],

  // Table 15: espacios & Table 16: croquis_espacio
  espacios: [
    { id: 1, codigo_espacio: 'A1', tipo: 'estandar', modalidad: 'Por Hora', estado: 'ocupado', nivel_id: 1, placa: '7892-KLL', driver: 'Carlos Mendoza', entryTime: '10:15', isMora: false, espacio_x: 10, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 2, codigo_espacio: 'A2', tipo: 'estandar', modalidad: 'Por Hora', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 60, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 3, codigo_espacio: 'A3', tipo: 'suv', modalidad: 'Por Hora', estado: 'mora', nivel_id: 1, placa: '4512-XYZ', driver: 'Mario Gómez', entryTime: '07:30', isMora: true, moraTime: '45 min', espacio_x: 110, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 4, codigo_espacio: 'A4', tipo: 'estandar', modalidad: 'Por Dia', estado: 'reservado', nivel_id: 1, placa: '6543-BBB', driver: 'Lucía Fernández', entryTime: null, reservedFor: '12:00', espacio_x: 160, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 5, codigo_espacio: 'A5', tipo: 'ev', modalidad: 'Por Hora', estado: 'ev', nivel_id: 1, placa: '9911-EVX', driver: 'Gabriel Paz', entryTime: '11:00', isMora: false, espacio_x: 210, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 6, codigo_espacio: 'A6', tipo: 'pmr', modalidad: 'Por Hora', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 260, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 7, codigo_espacio: 'A7', tipo: 'vip', modalidad: 'Mensual', estado: 'vip', nivel_id: 1, placa: '3344-VIP', driver: 'Empresa TechCorp', entryTime: '08:00', isAbonado: true, espacio_x: 310, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 8, codigo_espacio: 'A8', tipo: 'estandar', modalidad: 'Por Hora', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 360, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 9, codigo_espacio: 'A9', tipo: 'suv', modalidad: 'Por Hora', estado: 'inhabilitado', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, note: 'Mantenimiento de pintura', espacio_x: 410, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 10, codigo_espacio: 'A10', tipo: 'estandar', modalidad: 'Por Dia', estado: 'ocupado', nivel_id: 1, placa: '1234-ABC', driver: 'Ana Morales', entryTime: '09:45', isMora: false, espacio_x: 460, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 11, codigo_espacio: 'A11', tipo: 'moto', modalidad: 'Por Hora', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 510, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 12, codigo_espacio: 'A12', tipo: 'moto', modalidad: 'Por Hora', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 560, espacio_y: 20, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },

    { id: 13, codigo_espacio: 'B13', tipo: 'suv', modalidad: 'Por Dia', estado: 'ocupado', nivel_id: 1, placa: '5566-PDD', driver: 'Roberto Soliz', entryTime: '09:00', isMora: false, espacio_x: 10, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 14, codigo_espacio: 'B14', tipo: 'estandar', modalidad: 'Por Hora', estado: 'mora', nivel_id: 1, placa: '8833-BBB', driver: 'Jorge Valda', entryTime: '06:15', isMora: true, moraTime: '1h 15m', espacio_x: 60, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 15, codigo_espacio: 'B15', tipo: 'vip', modalidad: 'Mensual', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 110, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 16, codigo_espacio: 'B16', tipo: 'estandar', modalidad: 'Por Dia', estado: 'reservado', nivel_id: 1, placa: '7722-MMM', driver: 'Elena Roca', entryTime: null, reservedFor: '13:30', espacio_x: 160, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 17, codigo_espacio: 'B17', tipo: 'pmr', modalidad: 'Por Hora', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 210, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 18, codigo_espacio: 'B18', tipo: 'vip', modalidad: 'Mensual', estado: 'vip', nivel_id: 1, placa: '1122-ABO', driver: 'Dra. Patricia Siles', entryTime: '08:30', isAbonado: true, espacio_x: 260, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 19, codigo_espacio: 'B19', tipo: 'suv', modalidad: 'Por Hora', estado: 'ocupado', nivel_id: 1, placa: '4455-KKL', driver: 'Fernando Ugarte', entryTime: '10:30', isMora: false, espacio_x: 310, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 20, codigo_espacio: 'B20', tipo: 'estandar', modalidad: 'Mensual', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 360, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 21, codigo_espacio: 'B21', tipo: 'ev', modalidad: 'Por Hora', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 410, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 22, codigo_espacio: 'B22', tipo: 'estandar', modalidad: 'Por Dia', estado: 'ocupado', nivel_id: 1, placa: '9988-TTT', driver: 'Valeria Justiniano', entryTime: '11:10', isMora: false, espacio_x: 460, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 23, codigo_espacio: 'B23', tipo: 'estandar', modalidad: 'Por Hora', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 510, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 },
    { id: 24, codigo_espacio: 'B24', tipo: 'estandar', modalidad: 'Mensual', estado: 'disponible', nivel_id: 1, placa: null, driver: null, entryTime: null, isMora: false, espacio_x: 560, espacio_y: 120, alto: 60, ancho: 40, rotacion: 0, croquis_id: 1 }
  ],

  // Table 17: tarifas (PostgreSQL 14+ DDL Table 'tarifas')
  tarifas: [
    { id: 1, descripcion: "Tarifa Estándar Por Hora", fecha_inicio: "2026-01-01", monto: 10.00, modalidad: "Por Hora", estado: "activo", estacionamiento_id: 101 },
    { id: 2, descripcion: "Pase Diario Completo (24h)", fecha_inicio: "2026-01-01", monto: 70.00, modalidad: "Por Dia", estado: "activo", estacionamiento_id: 101 },
    { id: 3, descripcion: "Membresía Mensual Fija (Abonados)", fecha_inicio: "2026-01-01", monto: 450.00, modalidad: "Mensual", estado: "activo", estacionamiento_id: 101 },
    { id: 4, descripcion: "Tarifa Preferencial Carga EV (Por Hora)", fecha_inicio: "2026-02-15", monto: 15.00, modalidad: "Por Hora", estado: "activo", estacionamiento_id: 101 },
    { id: 5, descripcion: "Tarifa Reducida Motocicletas (Por Hora)", fecha_inicio: "2026-03-01", monto: 5.00, modalidad: "Por Hora", estado: "activo", estacionamiento_id: 101 }
  ],
  tariffConfig: {
    graceMinutes: 15,
    overtimeMultiplier: 1.5
  },

  // Table 18: planes
  planes: [
    { id: 1, titulo: "Plan Enterprise", descripcion: "Plazas ilimitadas y soporte IoT 24/7", costo: 299.00, estado: "activo", duracion: 30, porcentaje_comision: 8.50, limite_operadores: 10 }
  ],

  // Table 19: suscripciones
  suscripciones: [
    { id: 1, empresa_id: 1, plan_id: 1, fecha_adquirido: "2026-01-01", fecha_vencimiento: "2026-12-31", estado: "activa" }
  ],

  // Table 20: pagos_suscripciones
  pagos_suscripciones: [
    { id: 1, plan_id: 1, empresa_id: 1, monto_pagado: 299.00, fecha_pago: "2026-01-01T08:00:00Z", metodo_pago: "Transferencia", estado: "completado" }
  ],

  // Table 21: reservaciones
  reservaciones: [
    { id: 201, qr_token: "QR-PARK-8821-X9", total: 30.00, fecha_creacion: "2026-09-08T09:15:00Z", modalidad: "Por Hora", estado: "confirmada", empresa_id: 1, cliente_id: 102 },
    { id: 202, qr_token: "QR-PARK-9932-Y2", total: 70.00, fecha_creacion: "2026-09-08T08:30:00Z", modalidad: "Por Dia", estado: "en_curso", empresa_id: 1, cliente_id: 105 },
    { id: 203, qr_token: "QR-PARK-1044-Z7", total: 20.00, fecha_creacion: "2026-09-08T10:45:00Z", modalidad: "Por Hora", estado: "confirmada", empresa_id: 1, cliente_id: 108 },
    { id: 204, qr_token: "QR-PARK-3344-K1", total: 450.00, fecha_creacion: "2026-09-01T08:00:00Z", modalidad: "Mensual", estado: "completada", empresa_id: 1, cliente_id: 110 }
  ],

  // Table 22: detalle_reservacion
  detalle_reservacion: [
    { id: 501, inicio_reserva: "2026-09-08T12:00:00Z", fin_reserva: "2026-09-08T15:00:00Z", precio_unitario_aplicado: 10.00, subtotal: 30.00, estado: "reservado", reservacion_id: 201, espacio_id: 4, vehiculo_id: 301, tarifa_id: 1 },
    { id: 502, inicio_reserva: "2026-09-08T09:00:00Z", fin_reserva: "2026-09-09T09:00:00Z", precio_unitario_aplicado: 70.00, subtotal: 70.00, estado: "en_curso", reservacion_id: 202, espacio_id: 16, vehiculo_id: 302, tarifa_id: 2 },
    { id: 503, inicio_reserva: "2026-09-08T15:00:00Z", fin_reserva: "2026-09-08T17:00:00Z", precio_unitario_aplicado: 10.00, subtotal: 20.00, estado: "reservado", reservacion_id: 203, espacio_id: 5, vehiculo_id: 303, tarifa_id: 4 },
    { id: 504, inicio_reserva: "2026-09-01T00:00:00Z", fin_reserva: "2026-09-30T23:59:59Z", precio_unitario_aplicado: 450.00, subtotal: 450.00, estado: "reservado", reservacion_id: 204, espacio_id: 7, vehiculo_id: 304, tarifa_id: 3 }
  ],

  // Table 23: movimientos
  movimientos: [
    { id: 1, tipo_movimiento: "ENTRADA", fecha_hora: "2026-09-08T10:15:00Z", operador_id: 10, detalle_reservacion_id: 501, placa: "7892-KLL", driver: "Carlos Mendoza", codigo_espacio: "A1" },
    { id: 2, tipo_movimiento: "ENTRADA", fecha_hora: "2026-09-08T07:30:00Z", operador_id: 10, detalle_reservacion_id: 502, placa: "4512-XYZ", driver: "Mario Gómez", codigo_espacio: "A3" },
    { id: 3, tipo_movimiento: "ENTRADA", fecha_hora: "2026-09-08T11:00:00Z", operador_id: 10, detalle_reservacion_id: 503, placa: "9911-EVX", driver: "Gabriel Paz", codigo_espacio: "A5" },
    { id: 4, tipo_movimiento: "SALIDA", fecha_hora: "2026-09-08T11:45:00Z", operador_id: 10, detalle_reservacion_id: 504, placa: "6543-BBB", driver: "Lucía Fernández", codigo_espacio: "A4" }
  ],

  // Table 24: calificaciones
  calificaciones: [
    { id: 1, puntaje: 5, cliente_id: 102, comentario: "Excelente parqueo por QR.", fecha_creado: "2026-09-07T14:30:00Z", estacionamiento_id: 101 },
    { id: 2, puntaje: 5, cliente_id: 108, comentario: "Muy buena estación de carga EV. Espacios limpios.", fecha_creado: "2026-09-06T11:20:00Z", estacionamiento_id: 101 }
  ],

  // Table 25: advertencias
  advertencias: [
    { id: 1, cliente_id: 103, motivo: "Daño a barrera e historial de no pago", empresa_id: 1 },
    { id: 2, cliente_id: 103, motivo: "Abandono de vehículo por más de 48h", empresa_id: 1 }
  ],

  // Table 26: multas
  multas: [
    { id: 1, monto: 15.00, motivo: "Exceso de tiempo (+45 min)", fecha: "2026-09-08", hora: "11:30:00", estado_multa: "pendiente", empresa_id: 1, cliente_id: 103, detalle_reservacion_id: 501, reservacion_id: 201 },
    { id: 2, monto: 25.00, motivo: "Exceso de tiempo (+1h 15m)", fecha: "2026-09-08", hora: "10:45:00", estado_multa: "pendiente", empresa_id: 1, cliente_id: 103, detalle_reservacion_id: 502, reservacion_id: 202 }
  ],

  // Table 27: pagos
  pagos: [
    { id: 1, monto: 30.00, metodo_pago: "QR Banco FIE", fecha_emitido: "2026-09-08T09:16:00Z", estado: "completado", empresa_id: 1, reservacion_id: 201 },
    { id: 2, monto: 70.00, metodo_pago: "Tarjeta Visa", fecha_emitido: "2026-09-08T08:31:00Z", estado: "completado", empresa_id: 1, reservacion_id: 202 }
  ],

  // Table 28: facturas
  facturas: [
    { id: 1, monto_total: 30.00, fecha_emitido: "2026-09-08T09:16:00Z", nit: "1029384701", subtotal: 30.00, estado: "emitida", cliente_id: 102, reservacion_id: 201, empresa_id: 1 },
    { id: 2, monto_total: 70.00, fecha_emitido: "2026-09-08T08:31:00Z", nit: "4928102938", subtotal: 70.00, estado: "emitida", cliente_id: 105, reservacion_id: 202, empresa_id: 1 }
  ],

  // Table 29: comisiones_plataformas
  comisiones_plataformas: [
    { id: 1, porcentaje_aplicado: 8.50, monto_comision: 2.55, estado_cobro: "pendiente", fecha_generacion: "2026-09-08T09:16:00Z", monto_base: 30.00, empresa_id: 1, reservacion_id: 201 },
    { id: 2, porcentaje_aplicado: 8.50, monto_comision: 5.95, estado_cobro: "pendiente", fecha_generacion: "2026-09-08T08:31:00Z", monto_base: 70.00, empresa_id: 1, reservacion_id: 202 }
  ]
};

/* ==========================================================================
   1. NAVIGATION & SIDEBAR TOGGLE
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-view]');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      switchToView(targetView);
    });
  });
}

function switchToView(targetView) {
  const views = document.querySelectorAll('.dashboard-view');
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const titleDisplay = document.getElementById('current-page-title');
  const breadcrumbDisplay = document.getElementById('current-page-breadcrumb');

  views.forEach(view => {
    if (view.id === `view-${targetView}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  navItems.forEach(nav => {
    if (nav.getAttribute('data-view') === targetView) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');
    }
  });

  let viewName = 'Terminal Operativa de Caseta';
  if (targetView === 'registro-entrada') viewName = 'Registro de Entrada & Salida';
  if (targetView === 'croquis') viewName = 'Croquis & Monitoreo 24/7';
  if (targetView === 'reservas') viewName = 'Reservas & Abonados';
  if (targetView === 'mora') viewName = 'Mora & Lista Negra';
  if (targetView === 'configuracion') viewName = 'Tarifas & Reglas';
  if (targetView === 'reportes') viewName = 'Analíticas & Reseñas';
  if (targetView === 'operadores') {
    viewName = 'Gestión de Operadores de Parqueo';
    renderOperatorsTable();
  }

  if (titleDisplay) titleDisplay.textContent = viewName;
  if (breadcrumbDisplay) breadcrumbDisplay.textContent = `ParkinGo Equipetrol / ${viewName}`;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initSidebarToggle() {
  const toggleBtn = document.getElementById('toggle-sidebar');
  const sidebar = document.querySelector('.sidebar');
  const mainWrapper = document.querySelector('.main-wrapper');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        sidebar.classList.toggle('mobile-open');
      } else {
        sidebar.classList.toggle('collapsed');
        if (mainWrapper) mainWrapper.classList.toggle('collapsed');
      }
    });
  }
}

/* ==========================================================================
   2. CROQUIS & SLOTS RENDERER (Multi-Criteria Filters)
   ========================================================================== */
let croquisFilters = {
  mode: 'todos',
  category: 'todas',
  status: 'todos'
};

function initCroquis() {
  renderCroquisGrid();

  // Mode Filter Buttons
  document.querySelectorAll('.filter-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      croquisFilters.mode = btn.getAttribute('data-mode') || 'todos';
      renderCroquisGrid();
    });
  });

  // Category Filter Buttons
  document.querySelectorAll('.filter-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      croquisFilters.category = btn.getAttribute('data-category') || 'todas';
      renderCroquisGrid();
    });
  });

  // Status Filter Buttons
  document.querySelectorAll('.filter-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-status-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      croquisFilters.status = btn.getAttribute('data-status') || 'todos';
      renderCroquisGrid();
    });
  });
}

function renderCroquisGrid() {
  const gridContainer = document.getElementById('croquis-grid-container');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';

  const filteredSlots = DB.espacios.filter(slot => {
    const matchMode = (croquisFilters.mode === 'todos' || slot.modalidad === croquisFilters.mode || (croquisFilters.mode === 'hora' && slot.modalidad === 'Por Hora') || (croquisFilters.mode === 'dia' && slot.modalidad === 'Por Dia') || (croquisFilters.mode === 'mensual' && slot.modalidad === 'Mensual'));
    const matchCategory = (croquisFilters.category === 'todas' || slot.tipo === croquisFilters.category);
    const matchStatus = (croquisFilters.status === 'todos' || slot.estado === croquisFilters.status);
    return matchMode && matchCategory && matchStatus;
  });

  updateSlotCounters();

  if (filteredSlots.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 3rem; text-align: center; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-strong);">
        <i class="fa-solid fa-filter-circle-xmark" style="font-size: 2.5rem; color: var(--text-dim); margin-bottom: 0.75rem;"></i>
        <h4 style="margin: 0; color: var(--text-main);">No se encontraron espacios con los criterios seleccionados</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Intente cambiar el filtro de modo, categoría o estado.</p>
      </div>
    `;
    return;
  }

  filteredSlots.forEach(slot => {
    const slotCard = document.createElement('div');
    slotCard.className = `slot-card slot-status-${slot.estado}`;
    
    // Status Config
    let statusLabel = 'Disponible';
    let statusClass = 'badge-success';
    let icon = 'fa-circle-check';

    switch (slot.estado) {
      case 'ocupado': statusLabel = 'Ocupado'; statusClass = 'badge-dark'; icon = 'fa-car'; break;
      case 'mora': statusLabel = 'En Mora'; statusClass = 'badge-danger'; icon = 'fa-triangle-exclamation'; break;
      case 'reservado': statusLabel = 'Reservado'; statusClass = 'badge-info'; icon = 'fa-calendar'; break;
      case 'ev': statusLabel = 'Cargando EV'; statusClass = 'badge-warning'; icon = 'fa-bolt'; break;
      case 'vip': statusLabel = 'VIP Abonado'; statusClass = 'badge-purple'; icon = 'fa-crown'; break;
      case 'inhabilitado': statusLabel = 'Inhabilitado'; statusClass = 'badge-secondary'; icon = 'fa-ban'; break;
    }

    // Mode Badge Config
    let modeBadge = `<span class="badge" style="background:rgba(0,109,54,0.1); color:#006D36; font-size:0.65rem; border:1px solid rgba(0,109,54,0.2);"><i class="fa-solid fa-clock"></i> ${slot.modalidad}</span>`;

    // Category Badge Config
    let catBadge = '';
    switch (slot.tipo) {
      case 'estandar': catBadge = `<span class="badge badge-secondary" style="font-size:0.62rem;" title="Compacto / Sedán Estándar"><i class="fa-solid fa-car-side"></i> Estándar</span>`; break;
      case 'suv': catBadge = `<span class="badge badge-dark" style="font-size:0.62rem;" title="Espacio XL SUV & Camionetas"><i class="fa-solid fa-truck-pickup"></i> SUV/Camioneta</span>`; break;
      case 'ev': catBadge = `<span class="badge badge-warning" style="font-size:0.62rem;" title="Cargador Eléctrico Rápido"><i class="fa-solid fa-bolt"></i> Carga EV</span>`; break;
      case 'pmr': catBadge = `<span class="badge badge-info" style="font-size:0.62rem;" title="Movilidad Reducida Reservada"><i class="fa-solid fa-wheelchair"></i> PMR Accesible</span>`; break;
      case 'vip': catBadge = `<span class="badge badge-purple" style="font-size:0.62rem;" title="Techo Premium Cerca Garita"><i class="fa-solid fa-star"></i> VIP Techado</span>`; break;
      case 'moto': catBadge = `<span class="badge badge-secondary" style="font-size:0.62rem;" title="Sector Micro-movilidad"><i class="fa-solid fa-motorcycle"></i> Moto</span>`; break;
    }

    slotCard.innerHTML = `
      <div class="slot-header" style="flex-wrap:wrap; gap:0.25rem;">
        <span class="slot-code">${slot.codigo_espacio}</span>
        <div style="display:flex; gap:0.2rem; align-items:center;">
          ${modeBadge}
          <span class="badge ${statusClass}" style="font-size: 0.65rem; padding: 0.15rem 0.4rem;">
            <i class="fa-solid ${icon}"></i> ${statusLabel}
          </span>
        </div>
      </div>

      <div style="margin-bottom:0.4rem;">
        ${catBadge}
      </div>

      <div class="slot-body">
        ${slot.placa ? `<div class="slot-plate">${slot.placa}</div>` : `<div class="slot-empty">LIBRE</div>`}
        ${slot.driver ? `<div class="slot-driver"><i class="fa-solid fa-user"></i> ${slot.driver}</div>` : ''}
        ${slot.entryTime ? `<div class="slot-time"><i class="fa-solid fa-clock"></i> In: ${slot.entryTime}</div>` : ''}
        ${slot.isMora ? `<div class="slot-mora-tag"><i class="fa-solid fa-fire"></i> +${slot.moraTime} mora</div>` : ''}
      </div>

      <div class="slot-footer" style="margin-top:0.5rem;">
        <button class="btn btn-sm btn-outline-dark w-100" onclick="openSlotDrawer(${slot.id})">
          <i class="fa-solid fa-eye"></i> Detalle / Editar
        </button>
      </div>
    `;

    gridContainer.appendChild(slotCard);
  });
}

function updateSlotCounters() {
  const total = DB.espacios.length;
  const horaCount = DB.espacios.filter(s => s.modalidad === 'Por Hora').length;
  const diaCount = DB.espacios.filter(s => s.modalidad === 'Por Dia').length;
  const mensualCount = DB.espacios.filter(s => s.modalidad === 'Mensual').length;

  const countHoraEl = document.getElementById('count-mode-hora');
  const countDiaEl = document.getElementById('count-mode-dia');
  const countMensualEl = document.getElementById('count-mode-mensual');

  if (countHoraEl) countHoraEl.textContent = `${horaCount} plazas (${Math.round(horaCount/total*100)}%)`;
  if (countDiaEl) countDiaEl.textContent = `${diaCount} plazas (${Math.round(diaCount/total*100)}%)`;
  if (countMensualEl) countMensualEl.textContent = `${mensualCount} plazas (${Math.round(mensualCount/total*100)}%)`;
}

/* ==========================================================================
   3. SLOT DETAIL MODAL / DRAWER (Linked to DB espacios, croquis_espacio)
   ========================================================================== */
function openSlotDrawer(espacioId) {
  const slot = DB.espacios.find(s => s.id === espacioId || s.codigo_espacio === espacioId);
  if (!slot) return;

  const modal = document.getElementById('modalSlotDetail');
  const content = document.getElementById('slot-detail-content');

  if (!modal || !content) return;

  let catName = slot.tipo.toUpperCase();

  content.innerHTML = `
    <div class="detail-header-badge slot-status-${slot.estado}" style="padding: 0.8rem; border-radius: 6px; margin-bottom: 1rem; display:flex; align-items:center; justify-content:space-between;">
      <div>
        <h3 style="margin:0; font-size:1.2rem; display:flex; align-items:center; gap:0.5rem;">
          <i class="fa-solid fa-square-parking text-emerald"></i> Espacio ${slot.codigo_espacio} (DB ID: ${slot.id})
        </h3>
        <span style="font-size:0.78rem; opacity:0.8;">Nivel ID: <strong>${slot.nivel_id}</strong> | Croquis ID: <strong>${slot.croquis_id}</strong> (x:${slot.espacio_x}, y:${slot.espacio_y})</span>
      </div>
      <span class="badge badge-lg" style="font-size:0.85rem; padding:0.3rem 0.7rem;">${slot.estado.toUpperCase()}</span>
    </div>

    <div class="table-responsive" style="margin-bottom:1rem;">
      <table class="data-table" style="width:100%;">
        <tbody>
          <tr><th>Placa Vehículo</th><td><strong>${slot.placa || 'N/A'}</strong></td></tr>
          <tr><th>Conductor / Titular</th><td>${slot.driver || 'Sin ocupar'}</td></tr>
          <tr><th>Modalidad PostgreSQL</th><td><span class="badge badge-dark">${slot.modalidad}</span></td></tr>
          <tr><th>Tipo de Espacio</th><td><span class="badge badge-success">${catName}</span></td></tr>
          <tr><th>Hora de Ingreso</th><td>${slot.entryTime || 'N/A'}</td></tr>
          <tr><th>Estado de Mora</th><td>${slot.isMora ? `<span class="badge badge-danger">EXCEDIDO (+${slot.moraTime})</span>` : 'Normal (Dentro de tolerancia)'}</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Mode & Category -->
    <div style="background:var(--bg-primary); padding:0.75rem 1rem; border-radius:6px; border:1px solid var(--border-subtle); margin-bottom:1.2rem;">
      <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:0.4rem; color:var(--text-main);">Actualizar Registro en Tabla 'espacios':</label>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
        <select id="edit-slot-mode" class="org-selector" style="width:100%;">
          <option value="Por Hora" ${slot.modalidad === 'Por Hora' ? 'selected' : ''}>Por Hora</option>
          <option value="Por Dia" ${slot.modalidad === 'Por Dia' ? 'selected' : ''}>Por Día</option>
          <option value="Mensual" ${slot.modalidad === 'Mensual' ? 'selected' : ''}>Mensual</option>
        </select>
        <select id="edit-slot-cat" class="org-selector" style="width:100%;">
          <option value="estandar" ${slot.tipo === 'estandar' ? 'selected' : ''}>Estándar Compacto</option>
          <option value="suv" ${slot.tipo === 'suv' ? 'selected' : ''}>SUV & Camionetas</option>
          <option value="ev" ${slot.tipo === 'ev' ? 'selected' : ''}>Carga EV</option>
          <option value="pmr" ${slot.tipo === 'pmr' ? 'selected' : ''}>Movilidad Reducida</option>
          <option value="vip" ${slot.tipo === 'vip' ? 'selected' : ''}>VIP Techado</option>
          <option value="moto" ${slot.tipo === 'moto' ? 'selected' : ''}>Motos</option>
        </select>
      </div>
      <button class="btn btn-sm btn-outline-dark" style="margin-top:0.5rem; width:100%;" onclick="updateSlotConfiguration(${slot.id})">
        <i class="fa-solid fa-floppy-disk"></i> UPDATE espacios SET modalidad, tipo
      </button>
    </div>

    <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
      ${slot.estado === 'ocupado' || slot.estado === 'mora' ? `
        <button class="btn btn-danger" onclick="closeModal('modalSlotDetail'); openCheckOutModal('${slot.placa}')">
          <i class="fa-solid fa-receipt"></i> Procesar Cobro y Salida
        </button>
      ` : ''}
      ${slot.estado === 'disponible' ? `
        <button class="btn btn-primary" onclick="closeModal('modalSlotDetail'); openExpressEntryModal('${slot.codigo_espacio}')">
          <i class="fa-solid fa-cash-register"></i> Asignar Entrada
        </button>
      ` : ''}
      <button class="btn btn-secondary" onclick="closeModal('modalSlotDetail')">Cerrar</button>
    </div>
  `;

  modal.classList.add('active');
}

function updateSlotConfiguration(espacioId) {
  const slot = DB.espacios.find(s => s.id === espacioId);
  if (!slot) return;

  const newMode = document.getElementById('edit-slot-mode')?.value;
  const newCat = document.getElementById('edit-slot-cat')?.value;

  if (newMode) slot.modalidad = newMode;
  if (newCat) slot.tipo = newCat;

  closeModal('modalSlotDetail');
  renderCroquisGrid();
  showToast(`✅ UPDATE espacios SET modalidad='${newMode}', tipo='${newCat}' WHERE id=${espacioId};`, 'success');
}

/* ==========================================================================
   4. CHECK-IN / CHECK-OUT ENGINE (Linked to movimientos, pagos, facturas)
   ========================================================================== */
function openExpressEntryModal(preferredSlot = '') {
  const modal = document.getElementById('modalExpressEntry');
  if (!modal) return;

  const slotSelect = document.getElementById('express-slot-select');
  if (slotSelect) {
    slotSelect.innerHTML = '';
    const availableSlots = DB.espacios.filter(s => s.estado === 'disponible');
    availableSlots.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.codigo_espacio;
      opt.textContent = `Espacio ${s.codigo_espacio} (${s.modalidad} - ${s.tipo.toUpperCase()})`;
      if (s.codigo_espacio === preferredSlot) opt.selected = true;
      slotSelect.appendChild(opt);
    });
  }

  modal.classList.add('active');
}

function processExpressCheckIn(event) {
  if (event) event.preventDefault();

  const plateInput = document.getElementById('express-plate-input')?.value.trim().toUpperCase();
  const driverInput = document.getElementById('express-driver-input')?.value.trim() || 'Conductor Ocasional';
  const slotCode = document.getElementById('express-slot-select')?.value;

  if (!plateInput) {
    showToast('Por favor ingrese la placa del vehículo', 'warning');
    return;
  }

  // Check Table: advertencias
  const blacklisted = DB.advertencias.find(b => {
    const v = DB.vehiculos.find(v => v.id === b.cliente_id || v.placa === plateInput);
    return (v && v.placa === plateInput) || (b.cliente_id === 103 && plateInput === '8833-BBB');
  });

  if (blacklisted) {
    closeModal('modalExpressEntry');
    triggerBlacklistWarning(blacklisted, plateInput);
    return;
  }

  // Find slot in DB.espacios
  const slot = DB.espacios.find(s => s.codigo_espacio === slotCode);
  if (slot) {
    slot.estado = 'ocupado';
    slot.placa = plateInput;
    slot.driver = driverInput;
    const now = new Date();
    slot.entryTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    // INSERT INTO movimientos
    const newMov = {
      id: DB.movimientos.length + 1,
      tipo_movimiento: 'ENTRADA',
      fecha_hora: now.toISOString(),
      operador_id: 10,
      detalle_reservacion_id: 501,
      placa: plateInput,
      driver: driverInput,
      codigo_espacio: slotCode
    };

    DB.movimientos.unshift(newMov);
  }

  closeModal('modalExpressEntry');
  renderCroquisGrid();
  renderActiveVehiclesTable();
  renderMovimientosTable();
  populateCasetaPlazaSelect();
  updateCasetaKPIs();
  showToast(`✅ ENTRADA REGISTRADA: Placa ${plateInput} en Espacio ${slotCode}`, 'success');
  openTicketModal(DB.movimientos[0].id);
}

function triggerBlacklistWarning(blacklistedItem, plate) {
  const modal = document.getElementById('modalBlacklistAlert');
  if (!modal) return;

  const cliente = DB.clientes.find(c => c.id === blacklistedItem.cliente_id) || { nombre: 'Jorge', apellidos: 'Valda' };

  document.getElementById('blacklist-alert-plate').textContent = plate || '8833-BBB';
  document.getElementById('blacklist-alert-driver').textContent = `${cliente.nombre} ${cliente.apellidos}`;
  document.getElementById('blacklist-alert-reason').textContent = blacklistedItem.motivo;
  document.getElementById('blacklist-alert-date').textContent = '2026-08-14';

  modal.classList.add('active');
}

function openCheckOutModal(plate) {
  const slot = DB.espacios.find(s => s.placa === plate);
  if (!slot) {
    showToast('Vehículo no encontrado', 'warning');
    return;
  }

  const modal = document.getElementById('modalCheckOut');
  if (!modal) return;

  const hoursParked = slot.isMora ? 3.5 : 1.5;
  const tarifaBase = DB.tarifas[0]?.monto || 10.00;
  const baseCost = hoursParked * tarifaBase;
  const overtimePenalty = slot.isMora ? 15.00 : 0.00;
  const totalCost = baseCost + overtimePenalty;
  const now = new Date();

  document.getElementById('checkout-plate').textContent = slot.placa;
  document.getElementById('checkout-driver').textContent = slot.driver || 'Ocasional';
  document.getElementById('checkout-slot').textContent = `${slot.codigo_espacio} (${slot.modalidad})`;
  document.getElementById('checkout-entry').textContent = slot.entryTime || '09:00';
  document.getElementById('checkout-time').textContent = `${hoursParked} hrs`;
  document.getElementById('checkout-base').textContent = `Bs. ${baseCost.toFixed(2)}`;
  document.getElementById('checkout-penalty').textContent = `Bs. ${overtimePenalty.toFixed(2)}`;
  document.getElementById('checkout-total').textContent = `Bs. ${totalCost.toFixed(2)}`;

  document.getElementById('btn-confirm-checkout').onclick = () => {
    const plateExited = slot.placa;
    const driverExited = slot.driver;
    const slotExited = slot.codigo_espacio;

    // Release slot
    slot.estado = 'disponible';
    slot.placa = null;
    slot.driver = null;
    slot.entryTime = null;
    slot.isMora = false;

    // INSERT INTO movimientos
    const newMov = {
      id: DB.movimientos.length + 1,
      tipo_movimiento: 'SALIDA',
      fecha_hora: now.toISOString(),
      operador_id: 10,
      detalle_reservacion_id: 501,
      placa: plateExited,
      driver: driverExited,
      codigo_espacio: slotExited
    };
    DB.movimientos.unshift(newMov);

    // INSERT INTO pagos & facturas
    DB.pagos.push({ id: DB.pagos.length + 1, monto: totalCost, metodo_pago: 'Efectivo', fecha_emitido: now.toISOString(), estado: 'completado', empresa_id: 1, reservacion_id: 201 });
    DB.facturas.push({ id: DB.facturas.length + 1, monto_total: totalCost, fecha_emitido: now.toISOString(), nit: '1029384701', subtotal: baseCost, estado: 'emitida', cliente_id: 102, reservacion_id: 201, empresa_id: 1 });

    closeModal('modalCheckOut');
    renderCroquisGrid();
    renderActiveVehiclesTable();
    renderMovimientosTable();
    populateCasetaPlazaSelect();
    updateCasetaKPIs();

    showToast(`💰 SALIDA Y COBRO REGISTRADO: Placa ${plateExited}. Total: Bs. ${totalCost.toFixed(2)}. Espacio ${slotExited} liberado.`, 'success');
    openTicketModal(newMov.id);
  };

  modal.classList.add('active');
}

/* ==========================================================================
   4.1 INLINE TERMINAL CASETA CONTROLLERS (ENTRADA & SALIDA)
   ========================================================================== */

function switchCasetaMode(mode) {
  const panelEntrada = document.getElementById('caseta-panel-entrada');
  const panelSalida = document.getElementById('caseta-panel-salida');

  const btnEntrada = document.getElementById('btn-mode-tab-entrada');
  const btnSalida = document.getElementById('btn-mode-tab-salida');
  const btnDual = document.getElementById('btn-mode-tab-dual');

  if (!panelEntrada || !panelSalida) return;

  if (btnEntrada) btnEntrada.classList.remove('active');
  if (btnSalida) btnSalida.classList.remove('active');
  if (btnDual) btnDual.classList.remove('active');

  if (mode === 'entrada') {
    if (btnEntrada) btnEntrada.classList.add('active');
    panelEntrada.style.display = 'block';
    panelEntrada.classList.add('active');
    panelSalida.style.display = 'none';
    panelSalida.classList.remove('active');
  } else if (mode === 'salida') {
    if (btnSalida) btnSalida.classList.add('active');
    panelEntrada.style.display = 'none';
    panelEntrada.classList.remove('active');
    panelSalida.style.display = 'block';
    panelSalida.classList.add('active');
  } else if (mode === 'dual') {
    if (btnDual) btnDual.classList.add('active');
    panelEntrada.style.display = 'block';
    panelEntrada.classList.add('active');
    panelSalida.style.display = 'block';
    panelSalida.classList.add('active');
  }
}

function fillTestCheckIn(plate, driver) {
  const inputPlaca = document.getElementById('caseta-entrada-placa');
  const inputDriver = document.getElementById('caseta-entrada-conductor');
  const boletaSelect = document.getElementById('caseta-entrada-boleta');

  switchCasetaMode('entrada');

  // Try to find matching reservation for this plate
  const matchingRes = DB.reservaciones.find(r => {
    const d = DB.detalle_reservacion.find(det => det.reservacion_id === r.id);
    const v = d ? DB.vehiculos.find(veh => veh.id === d.vehiculo_id) : null;
    return v && v.placa === plate;
  });

  if (matchingRes && boletaSelect) {
    boletaSelect.value = matchingRes.id;
    handleSelectBoletaReserva(matchingRes.id);
  } else {
    if (boletaSelect) boletaSelect.value = 'EXPRESS_WITHOUT_RESERVATION';
    if (inputPlaca) inputPlaca.value = plate;
    if (inputDriver) inputDriver.value = driver;
    showToast(`⚡ Placa autocompletada: ${plate}`, 'info');
  }
}

function populateBoletasSelect() {
  const select = document.getElementById('caseta-entrada-boleta');
  if (!select) return;

  select.innerHTML = '';

  const placeholderOpt = document.createElement('option');
  placeholderOpt.value = '';
  placeholderOpt.textContent = '-- Paso 1: Seleccione una Boleta de Reserva Confirmada --';
  select.appendChild(placeholderOpt);

  const confirmadas = DB.reservaciones.filter(r => r.estado === 'confirmada' || r.estado === 'en_curso');

  if (confirmadas.length > 0) {
    const group = document.createElement('optgroup');
    group.label = 'Boletas de Reserva Activas (Tabla reservaciones)';
    confirmadas.forEach(res => {
      const cliente = DB.clientes.find(c => c.id === res.cliente_id) || { nombre: 'Cliente', apellidos: 'General' };
      const detalles = DB.detalle_reservacion.filter(d => d.reservacion_id === res.id);
      const primerDetalle = detalles[0] || {};
      const vehiculo = DB.vehiculos.find(v => v.id === primerDetalle.vehiculo_id) || { placa: '6543-BBB' };
      const espacio = DB.espacios.find(e => e.id === primerDetalle.espacio_id) || { codigo_espacio: 'A4' };

      const opt = document.createElement('option');
      opt.value = res.id;
      opt.textContent = `🎟️ BOLETA #${res.id} | QR: ${res.qr_token} | Placa: ${vehiculo.placa} (${cliente.nombre} ${cliente.apellidos}) | Plaza ${espacio.codigo_espacio}`;
      group.appendChild(opt);
    });
    select.appendChild(group);
  }

  const expressOpt = document.createElement('option');
  expressOpt.value = 'EXPRESS_WITHOUT_RESERVATION';
  expressOpt.textContent = '⚡ ENTRADA EXPRESS SIN RESERVA (Conductor Ocasional)';
  select.appendChild(expressOpt);
}

function handleSelectBoletaReserva(val) {
  const infoEl = document.getElementById('boleta-status-info');
  const plateInput = document.getElementById('caseta-entrada-placa');
  const driverInput = document.getElementById('caseta-entrada-conductor');
  const tipoInput = document.getElementById('caseta-entrada-tipo');
  const modalidadInput = document.getElementById('caseta-entrada-modalidad');
  const plazaSelect = document.getElementById('caseta-entrada-plaza');

  if (!val) {
    if (infoEl) {
      infoEl.innerHTML = `<i class="fa-solid fa-circle-info text-emerald"></i> Seleccione una boleta de reserva confirmada para importar automáticamente la placa, titular y plaza asignada.`;
    }
    return;
  }

  if (val === 'EXPRESS_WITHOUT_RESERVATION') {
    if (plateInput) plateInput.value = '';
    if (driverInput) driverInput.value = 'Conductor Ocasional';
    if (infoEl) {
      infoEl.innerHTML = `<span style="color:#D97706; font-weight:700;"><i class="fa-solid fa-bolt"></i> MODO INGRESO EXPRESS SIN RESERVA: Ingrese manualmente la placa del vehículo y seleccione la plaza disponible.</span>`;
    }
    showToast('⚡ Modo Ingreso Express sin reserva activado', 'info');
    return;
  }

  const resId = parseInt(val, 10);
  const res = DB.reservaciones.find(r => r.id === resId);
  if (!res) return;

  const cliente = DB.clientes.find(c => c.id === res.cliente_id) || { nombre: 'Cliente', apellidos: 'General' };
  const detalles = DB.detalle_reservacion.filter(d => d.reservacion_id === res.id);
  const primerDetalle = detalles[0] || {};
  const vehiculo = DB.vehiculos.find(v => v.id === primerDetalle.vehiculo_id) || { placa: '6543-BBB', tipo: 'suv' };
  const espacio = DB.espacios.find(e => e.id === primerDetalle.espacio_id) || { codigo_espacio: 'A4' };

  if (plateInput) plateInput.value = vehiculo.placa;
  if (driverInput) driverInput.value = `${cliente.nombre} ${cliente.apellidos}`;
  if (modalidadInput) {
    modalidadInput.value = res.modalidad;
    populateCasetaPlazaSelect();
  }

  if (tipoInput) {
    let t = (vehiculo.tipo || 'estandar').toLowerCase();
    if (t === 'suv') tipoInput.value = 'suv';
    else if (t === 'ev') tipoInput.value = 'ev';
    else if (t === 'vip') tipoInput.value = 'vip';
    else if (t === 'moto') tipoInput.value = 'moto';
    else tipoInput.value = 'estandar';
  }

  if (plazaSelect) {
    let foundOpt = Array.from(plazaSelect.options).find(o => o.value === espacio.codigo_espacio);
    if (!foundOpt) {
      const opt = document.createElement('option');
      opt.value = espacio.codigo_espacio;
      opt.textContent = `Plaza ${espacio.codigo_espacio} (RESERVADA PARA ESTA BOLETA)`;
      opt.selected = true;
      plazaSelect.appendChild(opt);
    } else {
      plazaSelect.value = espacio.codigo_espacio;
    }
  }

  if (infoEl) {
    infoEl.innerHTML = `<div style="color:#006D36; font-weight:800; background:rgba(0,109,54,0.08); padding:0.6rem; border-radius:6px; border:1px solid rgba(0,109,54,0.2);">
      <i class="fa-solid fa-circle-check"></i> BOLETA VALIDADA: Token <strong>${res.qr_token}</strong> | Cliente: <strong>${cliente.nombre} ${cliente.apellidos}</strong> | Plaza Pre-asignada: <strong>PLAZA ${espacio.codigo_espacio}</strong> (${res.modalidad})
    </div>`;
  }

  showToast(`🎟️ Boleta #${res.id} (${res.qr_token}) seleccionada. Datos de ${vehiculo.placa} cargados.`, 'success');
}

function updateCasetaKPIs() {
  const totalSlots = DB.espacios.length;
  const freeSlots = DB.espacios.filter(s => s.estado === 'disponible').length;
  const occupiedSlots = DB.espacios.filter(s => s.estado === 'ocupado' || s.estado === 'mora' || s.estado === 'ev' || s.estado === 'vip').length;
  const pctFree = totalSlots > 0 ? (freeSlots / totalSlots * 100).toFixed(1) : 0;

  const elFree = document.getElementById('kpi-plazas-libres');
  const elPct = document.getElementById('kpi-porcentaje-disponible');
  const elOccupied = document.getElementById('kpi-vehiculos-adentro');
  const elMovs = document.getElementById('kpi-movimientos-total');
  const elRevenue = document.getElementById('kpi-ingreso-estimado');

  if (elFree) elFree.innerHTML = `${freeSlots} <span style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">/ ${totalSlots}</span>`;
  if (elPct) elPct.textContent = `${pctFree}%`;
  if (elOccupied) elOccupied.textContent = occupiedSlots;
  if (elMovs) elMovs.textContent = DB.movimientos.length;

  const totalRevenue = DB.pagos.reduce((sum, p) => sum + (p.monto || 0), 0) + 1480;
  if (elRevenue) elRevenue.textContent = `Bs. ${totalRevenue.toFixed(2)}`;
}

function populateCasetaPlazaSelect() {
  const select = document.getElementById('caseta-entrada-plaza');
  if (!select) return;

  const selectedMode = document.getElementById('caseta-entrada-modalidad')?.value || 'Por Hora';
  select.innerHTML = '';

  const freeSlots = DB.espacios.filter(s => s.estado === 'disponible');

  if (freeSlots.length === 0) {
    select.innerHTML = '<option value="">❌ No hay plazas disponibles libres</option>';
    return;
  }

  const matchingSlots = freeSlots.filter(s => s.modalidad === selectedMode);
  const otherSlots = freeSlots.filter(s => s.modalidad !== selectedMode);

  if (matchingSlots.length > 0) {
    const optGroup = document.createElement('optgroup');
    optGroup.label = `Plazas configuradas en modalidad "${selectedMode}"`;
    matchingSlots.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.codigo_espacio;
      opt.textContent = `Plaza ${s.codigo_espacio} (${s.tipo.toUpperCase()}) - Disponible`;
      optGroup.appendChild(opt);
    });
    select.appendChild(optGroup);
  }

  if (otherSlots.length > 0) {
    const optGroup = document.createElement('optgroup');
    optGroup.label = `Otras plazas libres (Se ajustará modalidad)`;
    otherSlots.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.codigo_espacio;
      opt.textContent = `Plaza ${s.codigo_espacio} (${s.tipo.toUpperCase()}) - ${s.modalidad}`;
      optGroup.appendChild(opt);
    });
    select.appendChild(optGroup);
  }
}

function handleInlineCheckIn(event) {
  if (event) event.preventDefault();

  const plateInput = document.getElementById('caseta-entrada-placa')?.value.trim().toUpperCase();
  const driverInput = document.getElementById('caseta-entrada-conductor')?.value.trim() || 'Conductor General';
  const tipoInput = document.getElementById('caseta-entrada-tipo')?.value || 'estandar';
  const modalidadInput = document.getElementById('caseta-entrada-modalidad')?.value || 'Por Hora';
  const slotCode = document.getElementById('caseta-entrada-plaza')?.value;

  if (!plateInput) {
    showToast('Por favor ingrese la placa del vehículo', 'warning');
    return;
  }

  if (!slotCode) {
    showToast('No hay plaza disponible seleccionada', 'warning');
    return;
  }

  // Check Blacklist Table: advertencias
  const blacklisted = DB.advertencias.find(b => {
    const v = DB.vehiculos.find(v => v.id === b.cliente_id || v.placa === plateInput);
    return (v && v.placa === plateInput) || (b.cliente_id === 103 && plateInput === '8833-BBB');
  });

  if (blacklisted) {
    triggerBlacklistWarning(blacklisted, plateInput);
    return;
  }

  // Check if plate is already parked inside
  const existingSlot = DB.espacios.find(s => s.placa === plateInput && (s.estado === 'ocupado' || s.estado === 'mora' || s.estado === 'ev' || s.estado === 'vip'));
  if (existingSlot) {
    showToast(`⚠️ El vehículo con placa ${plateInput} ya figura adentro en Plaza ${existingSlot.codigo_espacio}`, 'danger');
    return;
  }

  const boletaVal = document.getElementById('caseta-entrada-boleta')?.value;
  let detResId = 501;
  if (boletaVal && boletaVal !== 'EXPRESS_WITHOUT_RESERVATION') {
    const resId = parseInt(boletaVal, 10);
    const res = DB.reservaciones.find(r => r.id === resId);
    if (res) {
      res.estado = 'en_curso';
      const det = DB.detalle_reservacion.find(d => d.reservacion_id === res.id);
      if (det) detResId = det.id;
    }
  }

  const slot = DB.espacios.find(s => s.codigo_espacio === slotCode);
  if (slot) {
    slot.estado = 'ocupado';
    slot.placa = plateInput;
    slot.driver = driverInput;
    slot.tipo = tipoInput;
    slot.modalidad = modalidadInput;
    const now = new Date();
    slot.entryTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const newMov = {
      id: DB.movimientos.length + 1,
      tipo_movimiento: 'ENTRADA',
      fecha_hora: now.toISOString(),
      operador_id: 10,
      detalle_reservacion_id: detResId,
      placa: plateInput,
      driver: driverInput,
      codigo_espacio: slotCode
    };

    DB.movimientos.unshift(newMov);
  }

  // Reset form inputs
  document.getElementById('caseta-entrada-placa').value = '';
  document.getElementById('caseta-entrada-conductor').value = '';
  if (document.getElementById('caseta-entrada-boleta')) document.getElementById('caseta-entrada-boleta').value = '';

  renderCroquisGrid();
  renderActiveVehiclesTable();
  renderReservationsTable();
  renderMovimientosTable();
  populateCasetaPlazaSelect();
  populateBoletasSelect();
  updateCasetaKPIs();

  showToast(`🚗 ENTRADA REGISTRADA: Placa ${plateInput} asignada a Plaza ${slotCode}. Barrera aperturada.`, 'success');
  openTicketModal(DB.movimientos[0].id);
}

let currentSalidaSlot = null;

function lookupSalidaVehicle() {
  const plateOrQr = document.getElementById('caseta-salida-placa')?.value.trim().toUpperCase();
  const previewBox = document.getElementById('caseta-salida-preview');
  const submitBtn = document.getElementById('btn-caseta-salida-submit');

  if (!plateOrQr) {
    showToast('Ingrese una placa o token QR para consultar', 'warning');
    return;
  }

  // Lookup in DB.espacios
  let slot = DB.espacios.find(s => s.placa === plateOrQr && (s.estado === 'ocupado' || s.estado === 'mora' || s.estado === 'ev' || s.estado === 'vip'));

  if (!slot) {
    const reservation = DB.reservaciones.find(r => r.qr_token.toUpperCase() === plateOrQr);
    if (reservation) {
      const detail = DB.detalle_reservacion.find(d => d.reservacion_id === reservation.id);
      if (detail) {
        slot = DB.espacios.find(s => s.id === detail.espacio_id);
      }
    }
  }

  if (!slot) {
    currentSalidaSlot = null;
    if (previewBox) {
      previewBox.innerHTML = `
        <div style="color:var(--accent-rose); text-align:center; padding:0.5rem;">
          <i class="fa-solid fa-circle-xmark" style="font-size:1.5rem; margin-bottom:0.25rem;"></i><br>
          <strong>No se encontró ningún vehículo estacionado con la placa/QR '${plateOrQr}'.</strong>
        </div>
      `;
    }
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  currentSalidaSlot = slot;

  const hoursParked = slot.isMora ? 3.5 : 1.5;
  const tarifaBase = DB.tarifas[0]?.monto || 10.00;
  const baseCost = hoursParked * tarifaBase;
  const overtimePenalty = slot.isMora ? 15.00 : 0.00;
  const totalCost = baseCost + overtimePenalty;

  if (previewBox) {
    previewBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem; font-size:0.9rem;">
        <span>Vehículo / Placa:</span>
        <strong style="font-size:1.05rem; color:#2563EB;">${slot.placa} (${slot.driver || 'Conductor'})</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
        <span>Plaza / Modalidad:</span>
        <span class="badge badge-dark">${slot.codigo_espacio} - ${slot.modalidad}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
        <span>Hora Ingreso / Tiempo:</span>
        <span>${slot.entryTime || '09:00'} (${hoursParked} hrs)</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem; color:var(--text-muted);">
        <span>Subtotal Estadía Base:</span>
        <span>Bs. ${baseCost.toFixed(2)}</span>
      </div>
      ${slot.isMora ? `
        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem; color:var(--accent-rose);">
          <span>Recargo por Mora Excedida:</span>
          <span>Bs. ${overtimePenalty.toFixed(2)}</span>
        </div>
      ` : ''}
      <div style="border-top:1px dashed var(--border-strong); padding-top:0.4rem; margin-top:0.4rem; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700;">TOTAL A COBRAR:</span>
        <span style="font-size:1.2rem; font-weight:800; color:var(--accent-emerald);">Bs. ${totalCost.toFixed(2)}</span>
      </div>
    `;
  }

  if (submitBtn) submitBtn.disabled = false;
}

function handleInlineCheckOut(event) {
  if (event) event.preventDefault();

  if (!currentSalidaSlot) {
    showToast('Por favor consulte una placa válida antes de registrar la salida', 'warning');
    return;
  }

  const slot = currentSalidaSlot;
  const metodoPago = document.getElementById('caseta-salida-metodo')?.value || 'Efectivo';
  const nitFactura = document.getElementById('caseta-salida-nit')?.value.trim() || '1029384701';

  const hoursParked = slot.isMora ? 3.5 : 1.5;
  const tarifaBase = DB.tarifas[0]?.monto || 10.00;
  const baseCost = hoursParked * tarifaBase;
  const overtimePenalty = slot.isMora ? 15.00 : 0.00;
  const totalCost = baseCost + overtimePenalty;
  const now = new Date();

  const plateExited = slot.placa;
  const driverExited = slot.driver;
  const slotExited = slot.codigo_espacio;

  // Release slot
  slot.estado = 'disponible';
  slot.placa = null;
  slot.driver = null;
  slot.entryTime = null;
  slot.isMora = false;

  // Insert into DB.movimientos
  const newMov = {
    id: DB.movimientos.length + 1,
    tipo_movimiento: 'SALIDA',
    fecha_hora: now.toISOString(),
    operador_id: 10,
    detalle_reservacion_id: 501,
    placa: plateExited,
    driver: driverExited,
    codigo_espacio: slotExited
  };
  DB.movimientos.unshift(newMov);

  // Insert into DB.pagos
  DB.pagos.push({
    id: DB.pagos.length + 1,
    monto: totalCost,
    metodo_pago: metodoPago,
    fecha_emitido: now.toISOString(),
    estado: 'completado',
    empresa_id: 1,
    reservacion_id: 201
  });

  // Insert into DB.facturas
  DB.facturas.push({
    id: DB.facturas.length + 1,
    monto_total: totalCost,
    fecha_emitido: now.toISOString(),
    nit: nitFactura,
    subtotal: baseCost,
    estado: 'emitida',
    cliente_id: 102,
    reservacion_id: 201,
    empresa_id: 1
  });

  // Reset form
  document.getElementById('caseta-salida-placa').value = '';
  document.getElementById('caseta-salida-preview').innerHTML = `
    <div style="color:var(--text-muted); text-align:center; padding:0.5rem;">
      <i class="fa-solid fa-car-side" style="font-size:1.5rem; margin-bottom:0.25rem;"></i><br>
      Ingrese una placa activa arriba y presione <strong>Consultar</strong> para calcular la estadía.
    </div>
  `;
  document.getElementById('btn-caseta-salida-submit').disabled = true;
  currentSalidaSlot = null;

  renderCroquisGrid();
  renderActiveVehiclesTable();
  renderMovimientosTable();
  populateCasetaPlazaSelect();
  updateCasetaKPIs();

  showToast(`💰 SALIDA REGISTRADA: Placa ${plateExited} en Plaza ${slotExited}. Total: Bs. ${totalCost.toFixed(2)} (${metodoPago})`, 'success');
  openTicketModal(newMov.id);
}

/* ==========================================================================
   5. TABLES RENDERER (Active Vehicles, Reservaciones, Multas, Tarifas CRUD)
   ========================================================================== */
function initTables() {
  renderActiveVehiclesTable();
  renderReservationsTable();
  renderMoraTable();
  renderTariffsTable();
  renderMovimientosTable();
  populateCasetaPlazaSelect();
  populateBoletasSelect();
  updateCasetaKPIs();
}

function renderMovimientosTable() {
  const tbody = document.getElementById('table-movimientos-caseta');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (DB.movimientos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:1.5rem;">No se registraron movimientos en caseta aún.</td></tr>`;
    return;
  }

  DB.movimientos.forEach(mov => {
    const tr = document.createElement('tr');

    const badgeTipo = mov.tipo_movimiento === 'ENTRADA' 
      ? `<span class="badge badge-success" style="font-size:0.75rem;"><i class="fa-solid fa-right-to-bracket"></i> ENTRADA</span>`
      : `<span class="badge badge-info" style="font-size:0.75rem;"><i class="fa-solid fa-right-from-bracket"></i> SALIDA</span>`;

    const formattedTime = mov.fecha_hora ? new Date(mov.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '12:00:00';
    const formattedDate = mov.fecha_hora ? new Date(mov.fecha_hora).toLocaleDateString() : '2026-09-08';

    tr.innerHTML = `
      <td><strong>#MOV-${String(mov.id).padStart(4, '0')}</strong></td>
      <td>${badgeTipo}</td>
      <td>${formattedDate} <strong>${formattedTime}</strong></td>
      <td><strong style="color:var(--text-main); font-size:0.95rem;">${mov.placa || '7892-KLL'}</strong></td>
      <td>${mov.driver || 'Carlos Mendoza'}</td>
      <td><span class="badge badge-dark">Plaza ${mov.codigo_espacio || 'A1'}</span></td>
      <td><span style="font-size:0.78rem; color:var(--text-muted);"><i class="fa-solid fa-user-shield"></i> Operador #${mov.operador_id}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-dark" onclick="openTicketModal(${mov.id})">
          <i class="fa-solid fa-print"></i> Ticket
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function openTicketModal(movimientoId) {
  const mov = DB.movimientos.find(m => m.id === movimientoId) || DB.movimientos[0];
  const modal = document.getElementById('modalPrintTicket');
  const body = document.getElementById('ticket-modal-body');
  if (!modal || !body) return;

  const nowStr = new Date().toLocaleString();

  body.innerHTML = `
    <div style="text-align:center; border-bottom:1px dashed #000; padding-bottom:0.5rem; margin-bottom:0.5rem;">
      <h3 style="margin:0; font-size:1.1rem; font-weight:800;">PARKINGO EQUIPETROL</h3>
      <p style="margin:0.2rem 0; font-size:0.75rem;">Av. San Martín #450 - Santa Cruz, Bolivia</p>
      <p style="margin:0; font-size:0.72rem;">NIT: 1029384029 | Tel: +591 3 342 9900</p>
    </div>

    <div style="margin-bottom:0.5rem; text-align:center; font-weight:800; font-size:1rem; letter-spacing:1px; background:#F1F5F9; padding:0.3rem;">
      COMPROBANTE DE ${mov.tipo_movimiento}
    </div>

    <div style="line-height:1.4; margin-bottom:0.5rem;">
      <div>NRO MOVIMIENTO : MOV-${String(mov.id).padStart(4,'0')}</div>
      <div>FECHA / HORA   : ${nowStr}</div>
      <div>OPERADOR GARITA: ID #${mov.operador_id}</div>
      <div>PLACA VEHÍCULO : <strong>${mov.placa || '7892-KLL'}</strong></div>
      <div>CONDUCTOR      : ${mov.driver || 'Conductor General'}</div>
      <div>PLAZA ASIGNADA : <strong>PLAZA ${mov.codigo_espacio || 'A1'}</strong></div>
    </div>

    <div style="border-top:1px dashed #000; border-bottom:1px dashed #000; padding:0.4rem 0; margin-bottom:0.5rem; text-align:center;">
      <div style="font-size:1.1rem; font-weight:800;">TICKET VÁLIDO DE CONTROL</div>
      <div style="font-size:0.7rem; color:#64748B;">Conserve este ticket para la validación de salida</div>
    </div>

    <div style="text-align:center; padding-top:0.2rem;">
      <div style="letter-spacing:4px; font-weight:800; font-size:1.2rem;">||| | |||| || | ||| ||</div>
      <div style="font-size:0.7rem; margin-top:0.2rem;">ParkinGo Terminal IoT v2.5</div>
    </div>
  `;

  modal.classList.add('active');
}

function triggerSalidaForPlate(plate) {
  switchToView('registro-entrada');
  switchCasetaMode('salida');
  const inputPlaca = document.getElementById('caseta-salida-placa');
  if (inputPlaca) {
    inputPlaca.value = plate;
    lookupSalidaVehicle();
  }
  showToast(`🔍 Cargando liquidación de salida para placa ${plate}`, 'info');
}

function renderActiveVehiclesTable() {
  const tbody = document.getElementById('table-active-vehicles');
  if (!tbody) return;

  tbody.innerHTML = '';

  const activeSlots = DB.espacios.filter(s => s.estado === 'ocupado' || s.estado === 'mora' || s.estado === 'ev' || s.estado === 'vip');

  if (activeSlots.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:1.5rem;">No hay vehículos registrados en este momento.</td></tr>`;
    return;
  }

  activeSlots.forEach(slot => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${slot.placa}</strong></td>
      <td>${slot.driver || 'Conductor General'}</td>
      <td><span class="badge badge-dark">${slot.codigo_espacio} (${slot.modalidad})</span></td>
      <td>${slot.entryTime || '09:30'}</td>
      <td>
        ${slot.isMora ? `<span class="badge badge-danger"><i class="fa-solid fa-fire"></i> EXCEDIDO (+${slot.moraTime})</span>` : `<span class="badge badge-success">Normal</span>`}
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="triggerSalidaForPlate('${slot.placa}')">
          <i class="fa-solid fa-receipt"></i> Cobrar / Salida
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderReservationsTable() {
  const tbody = document.getElementById('table-reservations');
  if (!tbody) return;

  tbody.innerHTML = '';

  DB.reservaciones.forEach(res => {
    const cliente = DB.clientes.find(c => c.id === res.cliente_id) || { nombre: 'Cliente', apellidos: 'General' };
    const detalles = DB.detalle_reservacion.filter(d => d.reservacion_id === res.id);
    const primerDetalle = detalles[0] || {};
    const vehiculo = DB.vehiculos.find(v => v.id === primerDetalle.vehiculo_id) || { placa: '6543-BBB', modelo: 'Vehículo' };
    const espacio = DB.espacios.find(e => e.id === primerDetalle.espacio_id) || { codigo_espacio: 'A4' };

    const tr = document.createElement('tr');

    let badgeStatus = 'badge-success';
    if (res.estado === 'en_curso') badgeStatus = 'badge-info';
    if (res.estado === 'completada') badgeStatus = 'badge-purple';

    tr.innerHTML = `
      <td><strong>${res.qr_token}</strong> <br><span style="font-size:0.68rem; color:var(--text-muted);">reservaciones.id = ${res.id}</span></td>
      <td><strong>${vehiculo.placa}</strong> <br><span style="font-size:0.68rem; color:var(--text-muted);">${vehiculo.modelo} (${vehiculo.color})</span></td>
      <td>${cliente.nombre} ${cliente.apellidos}</td>
      <td><span class="badge badge-dark">Espacio ${espacio.codigo_espacio}</span></td>
      <td>${primerDetalle.inicio_reserva ? primerDetalle.inicio_reserva.split('T')[1].substring(0,5) : '12:00'} hrs</td>
      <td><strong style="color:var(--accent-emerald);">Bs. ${res.total.toFixed(2)}</strong></td>
      <td><span class="badge ${badgeStatus}">${res.estado.toUpperCase()}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-dark" onclick="openReservationDetailModal(${res.id})" title="Inspeccionar relacionalidad 1..* detalle_reservacion">
          <i class="fa-solid fa-magnifying-glass"></i> Detalle DB
        </button>
        ${res.estado === 'confirmada' ? `
          <button class="btn btn-sm btn-primary" onclick="openExpressEntryModal('${espacio.codigo_espacio}')" title="Registrar movimiento [ENTRADA]">
            <i class="fa-solid fa-right-to-bracket"></i> Check-in
          </button>
        ` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openReservationDetailModal(reservaId) {
  const res = DB.reservaciones.find(r => r.id === reservaId);
  if (!res) return;

  const cliente = DB.clientes.find(c => c.id === res.cliente_id) || { nombre: 'Cliente', apellidos: 'General', correo: 'cliente@parkingo.bo', telefono: '+591 700 00000' };
  const detalles = DB.detalle_reservacion.filter(d => d.reservacion_id === res.id);
  const pago = DB.pagos.find(p => p.reservacion_id === res.id) || { monto: res.total, metodo_pago: 'QR Banco', estado: 'completado' };
  const factura = DB.facturas.find(f => f.reservacion_id === res.id) || { nit: '1029384701', estado: 'emitida' };

  const modal = document.getElementById('modalReservationDetail');
  const content = document.getElementById('reservation-detail-content');

  if (!modal || !content) return;

  let detallesHTML = detalles.map(d => {
    const vehiculo = DB.vehiculos.find(v => v.id === d.vehiculo_id) || { placa: 'N/A', modelo: 'N/A', color: 'N/A' };
    const espacio = DB.espacios.find(e => e.id === d.espacio_id) || { codigo_espacio: 'N/A' };
    const tarifa = DB.tarifas.find(t => t.id === d.tarifa_id) || { descripcion: 'Tarifa General', monto: d.precio_unitario_aplicado };

    return `
      <div style="background:var(--bg-primary); padding:0.85rem; border-radius:6px; margin-bottom:0.75rem; border:1px solid var(--border-subtle);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <span class="badge badge-dark">Tabla 'detalle_reservacion' ID: #${d.id}</span>
          <span class="badge badge-success">estado: ${d.estado}</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.82rem;">
          <div><strong>FK espacio_id:</strong> Espacio ${espacio.codigo_espacio} (ID: ${d.espacio_id})</div>
          <div><strong>FK vehiculo_id:</strong> ${vehiculo.placa} (${vehiculo.modelo} - ${vehiculo.color})</div>
          <div><strong>inicio_reserva:</strong> ${d.inicio_reserva}</div>
          <div><strong>fin_reserva:</strong> ${d.fin_reserva}</div>
          <div><strong>FK tarifa_id:</strong> ${tarifa.descripcion} (Bs. ${d.precio_unitario_aplicado.toFixed(2)})</div>
          <div><strong>subtotal:</strong> <strong style="color:var(--accent-emerald);">Bs. ${d.subtotal.toFixed(2)}</strong></div>
        </div>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <div style="background:#063D25; color:#FFF; padding:1rem; border-radius:6px; margin-bottom:1.2rem; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h3 style="margin:0; font-size:1.15rem;"><i class="fa-solid fa-qrcode"></i> qr_token: ${res.qr_token}</h3>
        <span style="font-size:0.78rem; opacity:0.85;">Tabla 'reservaciones' PK id = #${res.id} | fecha_creacion: ${res.fecha_creacion}</span>
      </div>
      <span class="badge badge-lg badge-success" style="font-size:0.85rem; padding:0.35rem 0.75rem;">${res.estado.toUpperCase()}</span>
    </div>

    <!-- Cliente Header -->
    <div style="background:var(--bg-card); padding:0.85rem; border-radius:6px; border:1px solid var(--border-subtle); margin-bottom:1rem;">
      <h4 style="margin:0 0 0.5rem 0; font-size:0.9rem; color:var(--text-main);"><i class="fa-solid fa-user text-emerald"></i> Tabla 'clientes' (FK cliente_id = ${res.cliente_id})</h4>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.82rem;">
        <div><strong>Nombre:</strong> ${cliente.nombre} ${cliente.apellidos}</div>
        <div><strong>Correo:</strong> ${cliente.correo}</div>
        <div><strong>Teléfono:</strong> ${cliente.telefono}</div>
        <div><strong>modalidad:</strong> <span class="badge badge-dark">${res.modalidad}</span></div>
      </div>
    </div>

    <!-- Detalle_reservacion List (1..*) -->
    <h4 style="margin:1rem 0 0.5rem 0; font-size:0.9rem; color:var(--text-main);"><i class="fa-solid fa-list-check text-emerald"></i> Tabla 'detalle_reservacion' (Relación 1..*)</h4>
    ${detallesHTML}

    <!-- Pago & Factura Details -->
    <div style="background:var(--bg-card); padding:0.85rem; border-radius:6px; border:1px solid var(--border-subtle); margin-bottom:1.2rem;">
      <h4 style="margin:0 0 0.5rem 0; font-size:0.9rem; color:var(--text-main);"><i class="fa-solid fa-file-invoice-dollar text-emerald"></i> Tablas 'pagos' & 'facturas'</h4>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.82rem;">
        <div><strong>metodo_pago:</strong> ${pago.metodo_pago}</div>
        <div><strong>estado (pagos):</strong> <span class="badge badge-success">${pago.estado}</span></div>
        <div><strong>nit (facturas):</strong> ${factura.nit}</div>
        <div><strong>total (reservaciones):</strong> <strong style="font-size:1.05rem; color:var(--accent-emerald);">Bs. ${res.total.toFixed(2)}</strong></div>
      </div>
    </div>

    <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
      <button class="btn btn-secondary" onclick="closeModal('modalReservationDetail')">Cerrar</button>
      <button class="btn btn-primary" onclick="closeModal('modalReservationDetail'); showToast('🖨️ Imprimiendo Comprobante de qr_token...', 'success')">
        <i class="fa-solid fa-print"></i> Imprimir Token QR
      </button>
    </div>
  `;

  modal.classList.add('active');
}

function renderMoraTable() {
  const tbody = document.getElementById('table-mora-list');
  if (!tbody) return;

  tbody.innerHTML = '';
  DB.multas.forEach(m => {
    const cliente = DB.clientes.find(c => c.id === m.cliente_id) || { nombre: 'Cliente' };
    const vehiculo = DB.vehiculos.find(v => v.propietario_id === m.cliente_id) || { placa: '8833-BBB' };
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color:var(--accent-rose);">${vehiculo.placa}</strong> <br><span style="font-size:0.68rem; color:var(--text-muted);">multas.id = #${m.id}</span></td>
      <td>${cliente.nombre} ${cliente.apellidos}</td>
      <td><span class="badge badge-danger">Detalle #${m.detalle_reservacion_id || 501}</span></td>
      <td>${m.hora}</td>
      <td><strong style="color:var(--accent-rose);">${m.motivo}</strong></td>
      <td><strong>Bs. ${m.monto.toFixed(2)}</strong></td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="openCheckOutModal('${vehiculo.placa}')">
          <i class="fa-solid fa-gavel"></i> Cobrar Multa
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================================================
   6. FULL CRUD ENGINE FOR TABLA 'tarifas'
   ========================================================================== */
function renderTariffsTable() {
  const tbody = document.getElementById('table-tariffs-list');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (DB.tarifas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:1.5rem;">No hay tarifas registradas en la tabla 'tarifas'.</td></tr>`;
    return;
  }

  DB.tarifas.forEach(t => {
    const tr = document.createElement('tr');
    const badgeStatus = t.estado === 'activo' ? 'badge-success' : 'badge-secondary';
    
    tr.innerHTML = `
      <td><strong>#${t.id}</strong></td>
      <td><strong>${t.descripcion}</strong></td>
      <td><span class="badge badge-dark">${t.modalidad}</span></td>
      <td><strong style="color:var(--accent-emerald); font-size:1rem;">Bs. ${t.monto.toFixed(2)}</strong></td>
      <td>${t.fecha_inicio}</td>
      <td><span class="badge ${badgeStatus}">${t.estado.toUpperCase()}</span></td>
      <td>
        <div style="display:flex; gap:0.35rem;">
          <button class="btn btn-sm btn-outline-dark" onclick="openEditTariffModal(${t.id})" title="Editar campos de esta tarifa">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </button>
          <button class="btn btn-sm ${t.estado === 'activo' ? 'btn-outline-danger' : 'btn-outline-success'}" onclick="toggleTariffStatus(${t.id})" title="Cambiar estado en DB">
            <i class="fa-solid ${t.estado === 'activo' ? 'fa-ban' : 'fa-check'}"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteTariff(${t.id})" title="Eliminar registro de la tabla 'tarifas'">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function openCreateTariffModal() {
  const modal = document.getElementById('modalTariffForm');
  if (!modal) return;

  document.getElementById('modal-tariff-title').textContent = '➕ Crear Nueva Tarifa (Tabla tarifas)';
  document.getElementById('edit-tariff-id').value = '';
  document.getElementById('edit-tariff-descripcion').value = '';
  document.getElementById('edit-tariff-modalidad').value = 'Por Hora';
  document.getElementById('edit-tariff-monto').value = '10.00';
  document.getElementById('edit-tariff-fecha-inicio').value = new Date().toISOString().split('T')[0];
  document.getElementById('edit-tariff-estado').value = 'activo';

  modal.classList.add('active');
}

function openEditTariffModal(tariffId) {
  const tariff = DB.tarifas.find(t => t.id === tariffId);
  if (!tariff) return;

  const modal = document.getElementById('modalTariffForm');
  if (!modal) return;

  document.getElementById('modal-tariff-title').textContent = `✏️ Editar Tarifa (ID: #${tariff.id})`;
  document.getElementById('edit-tariff-id').value = tariff.id;
  document.getElementById('edit-tariff-descripcion').value = tariff.descripcion;
  document.getElementById('edit-tariff-modalidad').value = tariff.modalidad;
  document.getElementById('edit-tariff-monto').value = tariff.monto.toFixed(2);
  document.getElementById('edit-tariff-fecha-inicio').value = tariff.fecha_inicio;
  document.getElementById('edit-tariff-estado').value = tariff.estado;

  modal.classList.add('active');
}

function saveTariff(event) {
  if (event) event.preventDefault();

  const idVal = document.getElementById('edit-tariff-id')?.value;
  const descripcion = document.getElementById('edit-tariff-descripcion')?.value.trim();
  const modalidad = document.getElementById('edit-tariff-modalidad')?.value;
  const monto = parseFloat(document.getElementById('edit-tariff-monto')?.value) || 0;
  const fecha_inicio = document.getElementById('edit-tariff-fecha-inicio')?.value || new Date().toISOString().split('T')[0];
  const estado = document.getElementById('edit-tariff-estado')?.value || 'activo';

  if (!descripcion) {
    showToast('Por favor ingrese la descripción de la tarifa', 'warning');
    return;
  }

  if (idVal) {
    // UPDATE
    const tariff = DB.tarifas.find(t => t.id === parseInt(idVal));
    if (tariff) {
      tariff.descripcion = descripcion;
      tariff.modalidad = modalidad;
      tariff.monto = monto;
      tariff.fecha_inicio = fecha_inicio;
      tariff.estado = estado;
      showToast(`✅ UPDATE tarifas SET descripcion='${descripcion}', monto=${monto} WHERE id=${idVal};`, 'success');
    }
  } else {
    // INSERT INTO tarifas
    const newId = DB.tarifas.length > 0 ? Math.max(...DB.tarifas.map(t => t.id)) + 1 : 1;
    DB.tarifas.push({
      id: newId,
      descripcion: descripcion,
      fecha_inicio: fecha_inicio,
      monto: monto,
      modalidad: modalidad,
      estado: estado,
      estacionamiento_id: 101
    });
    showToast(`✅ INSERT INTO tarifas (id, descripcion, monto, modalidad) VALUES (${newId}, '${descripcion}', ${monto}, '${modalidad}');`, 'success');
  }

  closeModal('modalTariffForm');
  renderTariffsTable();
}

function toggleTariffStatus(tariffId) {
  const tariff = DB.tarifas.find(t => t.id === tariffId);
  if (!tariff) return;

  tariff.estado = tariff.estado === 'activo' ? 'inactivo' : 'activo';
  renderTariffsTable();
  showToast(`⚙️ Estado de Tarifa #${tariffId} cambiado a '${tariff.estado}'`, 'info');
}

function deleteTariff(tariffId) {
  const index = DB.tarifas.findIndex(t => t.id === tariffId);
  if (index !== -1) {
    DB.tarifas.splice(index, 1);
    renderTariffsTable();
    showToast(`🗑️ DELETE FROM tarifas WHERE id=${tariffId};`, 'warning');
  }
}

function initTariffForm() {
  const form = document.getElementById('form-tariff-settings');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (DB.tarifas[0]) DB.tarifas[0].monto = parseFloat(document.getElementById('tariff-hourly').value) || 10;
    if (DB.tarifas[1]) DB.tarifas[1].monto = parseFloat(document.getElementById('tariff-daily').value) || 70;
    if (DB.tarifas[2]) DB.tarifas[2].monto = parseFloat(document.getElementById('tariff-monthly').value) || 450;
    DB.tariffConfig.graceMinutes = parseInt(document.getElementById('tariff-grace').value) || 15;

    showToast('⚙️ Parámetros operativos y tolerancias guardadas', 'success');
  });
}

/* ==========================================================================
   7. CHART.JS ANALYTICAL CHARTS
   ========================================================================== */
let chartHoursInstance = null;
let chartRevenueInstance = null;

function initCharts() {
  initHoursChart();
  initRevenueChart();
}

function initHoursChart() {
  const ctx = document.getElementById('chartPeakHours')?.getContext('2d');
  if (!ctx) return;

  chartHoursInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
      datasets: [{
        label: 'Ocupación de Vehículos (Tabla espacios)',
        data: [5, 18, 22, 24, 19, 23, 16, 8],
        backgroundColor: '#006D36',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

function initRevenueChart() {
  const ctx = document.getElementById('chartWeeklyRevenue')?.getContext('2d');
  if (!ctx) return;

  chartRevenueInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Ingresos Diarios (Tabla pagos)',
        data: [1200, 1450, 1380, 1600, 2100, 2450, 1900],
        borderColor: '#006D36',
        backgroundColor: 'rgba(0, 109, 54, 0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

/* ==========================================================================
   8. UTILITIES (Clock, Toast, Modal helpers)
   ========================================================================== */
function initClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  setInterval(() => {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString();
  }, 1000);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    background: #063D25;
    color: #FFFFFF;
    border-left: 4px solid ${type === 'success' ? '#22C55E' : type === 'warning' ? '#F59E0B' : '#EF4444'};
    padding: 0.75rem 1.25rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: fadeIn 0.2s ease-out;
  `;
  toast.innerHTML = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

/* ==========================================================================
   9. GESTIÓN DE OPERADORES DE PARQUEO (OPERATOR MANAGEMENT MODULE)
   ========================================================================== */
function renderOperatorsTable() {
  const tbody = document.getElementById('operators-table-body');
  if (!tbody) return;

  const searchInput = document.getElementById('op-search-input');
  const statusFilter = document.getElementById('op-status-filter');

  const query = (searchInput ? searchInput.value : '').trim().toUpperCase();
  const filter = statusFilter ? statusFilter.value : 'all';

  let list = DB.operadores || [];

  if (filter === 'activo') list = list.filter(o => o.estado === 'activo');
  else if (filter === 'en-sitio') list = list.filter(o => o.estado === 'en-sitio');
  else if (filter === 'inactivo') list = list.filter(o => o.estado === 'inactivo');

  if (query) {
    list = list.filter(o =>
      o.nombre.toUpperCase().includes(query) ||
      o.ci.toUpperCase().includes(query) ||
      o.telefono.toUpperCase().includes(query) ||
      o.garita.toUpperCase().includes(query)
    );
  }

  updateOperatorKPIs();

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">
          No se encontraron operadores registrados con los criterios seleccionados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(op => {
    const initials = op.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const statusBadges = {
      'en-sitio': '<span class="badge badge-success" style="font-size:0.75rem;"><i class="fa-solid fa-circle"></i> En Turno Ahora</span>',
      'activo': '<span class="badge badge-info" style="font-size:0.75rem;"><i class="fa-solid fa-check"></i> Activo</span>',
      'inactivo': '<span class="badge badge-neutral" style="font-size:0.75rem;"><i class="fa-solid fa-ban"></i> Inactivo / Licencia</span>'
    };

    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div style="width:36px; height:36px; border-radius:50%; background:#006D36; color:#FFF; font-weight:800; font-family:'Outfit'; display:flex; align-items:center; justify-content:center; font-size:0.85rem; flex-shrink:0;">
              ${initials}
            </div>
            <div>
              <div style="font-weight:700; color:var(--text-main); font-size:0.9rem;">${op.nombre}</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">Registrado: ${op.fecha_registro}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight:600; color:var(--text-main);"><i class="fa-solid fa-id-card text-emerald"></i> ${op.ci}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-phone"></i> ${op.telefono}</div>
        </td>
        <td>
          <span class="badge badge-neutral" style="font-size:0.75rem; font-weight:700;">
            <i class="fa-solid fa-cash-register text-emerald"></i> ${op.garita}
          </span>
        </td>
        <td>
          <div style="font-size:0.82rem; font-weight:600; color:var(--text-main);">${op.turno}</div>
        </td>
        <td>
          <div style="font-size:0.78rem; font-family:monospace; color:#063D25; font-weight:700;">${op.correo}</div>
        </td>
        <td>
          ${statusBadges[op.estado] || '<span class="badge badge-neutral">Activo</span>'}
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-sm btn-primary" onclick="openOperatorReportModal(${op.id})" title="Ver Reporte y Métricas de este Operador" style="background:#063D25;">
              <i class="fa-solid fa-chart-line"></i> Reporte
            </button>
            <button class="btn btn-sm btn-secondary" onclick="openOperatorFormModal(${op.id})" title="Editar Datos del Operador">
              <i class="fa-solid fa-pen-to-square"></i> Editar
            </button>
            <button class="btn btn-sm ${op.estado === 'inactivo' ? 'btn-primary' : 'btn-outline'}" onclick="toggleOperatorStatus(${op.id})" title="${op.estado === 'inactivo' ? 'Activar Operador' : 'Desactivar Operador'}">
              <i class="fa-solid ${op.estado === 'inactivo' ? 'fa-user-check' : 'fa-user-slash'}"></i>
            </button>
            <a href="parking-operator.html" class="btn btn-sm btn-outline" style="border-color:#2563EB; color:#2563EB;" title="Ingresar como este operador en Garita">
              <i class="fa-solid fa-right-to-bracket"></i> Garita
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateOperatorKPIs() {
  const total = DB.operadores.length;
  const activeNow = DB.operadores.filter(o => o.estado === 'en-sitio').length;

  const elTotal = document.getElementById('op-stat-total');
  const elActive = document.getElementById('op-stat-active');
  const badgeNav = document.getElementById('badge-count-operadores');

  if (elTotal) elTotal.textContent = total;
  if (elActive) elActive.textContent = activeNow;
  if (badgeNav) badgeNav.textContent = total;
}

function openOperatorFormModal(operatorId = null) {
  const modalTitle = document.getElementById('operator-modal-title');
  const editIdInput = document.getElementById('edit-operator-id');
  const form = document.getElementById('operator-form');

  if (operatorId) {
    const op = DB.operadores.find(o => o.id === operatorId);
    if (!op) return;

    if (modalTitle) modalTitle.innerHTML = `<i class="fa-solid fa-user-pen"></i> Editar Datos de Operador`;
    if (editIdInput) editIdInput.value = op.id;

    document.getElementById('op-input-name').value = op.nombre;
    document.getElementById('op-input-ci').value = op.ci;
    document.getElementById('op-input-phone').value = op.telefono;
    document.getElementById('op-input-email').value = op.correo;
    document.getElementById('op-input-garita').value = op.garita;
    document.getElementById('op-input-shift').value = op.turno;
    document.getElementById('op-input-status').value = op.estado;
  } else {
    if (modalTitle) modalTitle.innerHTML = `<i class="fa-solid fa-user-plus"></i> Registrar Nuevo Operador`;
    if (editIdInput) editIdInput.value = '';
    if (form) form.reset();
  }

  openModal('modalOperatorForm');
}

function handleOperatorFormSubmit(event) {
  event.preventDefault();

  const editId = document.getElementById('edit-operator-id').value;
  const name = document.getElementById('op-input-name').value.trim();
  const ci = document.getElementById('op-input-ci').value.trim();
  const phone = document.getElementById('op-input-phone').value.trim();
  const email = document.getElementById('op-input-email').value.trim();
  const garita = document.getElementById('op-input-garita').value;
  const shift = document.getElementById('op-input-shift').value;
  const status = document.getElementById('op-input-status').value;

  if (editId) {
    const op = DB.operadores.find(o => o.id == editId);
    if (op) {
      op.nombre = name;
      op.ci = ci;
      op.telefono = phone;
      op.correo = email;
      op.garita = garita;
      op.turno = shift;
      op.estado = status;
      showToast(`Operador ${name} actualizado correctamente`, 'success');
    }
  } else {
    const newOp = {
      id: Date.now(),
      nombre: name,
      ci: ci,
      telefono: phone,
      correo: email,
      garita: garita,
      turno: shift,
      estado: status,
      fecha_registro: new Date().toISOString().split('T')[0]
    };
    DB.operadores.push(newOp);
    showToast(`Operador ${name} registrado e ingresado al sistema`, 'success');
  }

  closeModal('modalOperatorForm');
  renderOperatorsTable();
}

function toggleOperatorStatus(operatorId) {
  const op = DB.operadores.find(o => o.id === operatorId);
  if (!op) return;

  if (op.estado === 'inactivo') {
    op.estado = 'activo';
    showToast(`Operador ${op.nombre} activado`, 'success');
  } else {
    op.estado = 'inactivo';
    showToast(`Operador ${op.nombre} cambiado a inactivo`, 'warning');
  }

  renderOperatorsTable();
}

/* ==========================================================================
   REPORTE INDIVIDUAL POR OPERADOR & PARQUEO
   ========================================================================== */
function openOperatorReportModal(operatorId = null) {
  const selectOperator = document.getElementById('report-select-operator');
  if (selectOperator) {
    selectOperator.innerHTML = DB.operadores.map(o => `
      <option value="${o.id}" ${operatorId && o.id === operatorId ? 'selected' : ''}>${o.nombre} (${o.garita})</option>
    `).join('');
  }

  updateOperatorReportFromSelectors();
  openModal('modalOperatorReport');
}

function updateOperatorReportFromSelectors() {
  const opId = parseInt(document.getElementById('report-select-operator')?.value || '1', 10);
  const parqueoSelect = document.getElementById('report-select-parqueo');
  const periodSelect = document.getElementById('report-select-period');

  const op = DB.operadores.find(o => o.id === opId) || DB.operadores[0];
  const parqueoName = parqueoSelect ? parqueoSelect.options[parqueoSelect.selectedIndex].text : 'ParkinGo Equipetrol Central';
  const periodName = periodSelect ? periodSelect.options[periodSelect.selectedIndex].text : 'Turno de Hoy';

  const container = document.getElementById('operator-report-content');
  if (!container || !op) return;

  // Mock metrics calculation per operator
  const isCarlos = op.nombre.includes('Carlos');
  const atendidos = isCarlos ? 28 : (op.id === 2 ? 19 : 14);
  const walkins = isCarlos ? 12 : 6;
  const multas = isCarlos ? 3 : 1;
  const recaudacionTotal = isCarlos ? 640.00 : (op.id === 2 ? 430.00 : 290.00);

  const efec = Math.round(recaudacionTotal * 0.6);
  const qr = Math.round(recaudacionTotal * 0.25);
  const tarj = Math.round(recaudacionTotal - efec - qr);

  container.innerHTML = `
    <div style="text-align:center; padding-bottom:0.85rem; border-bottom:1px dashed #CBD5E1; margin-bottom:1rem;">
      <span class="badge badge-success" style="font-size:0.75rem;">Reporte Auditable de Garita</span>
      <h3 style="font-family:'Outfit'; font-size:1.4rem; color:#063D25; margin:0.2rem 0;">${op.nombre}</h3>
      <p style="margin:0; font-size:0.85rem; color:#64748B; font-weight:600;">
        Parqueo: <strong style="color:#006D36;">${parqueoName}</strong> &bull; ${op.turno}
      </p>
    </div>

    <!-- KPIs del Operador -->
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.75rem; margin-bottom:1.2rem;">
      <div style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:6px; padding:0.75rem; text-align:center;">
        <span style="font-size:0.7rem; color:#15803D; font-weight:700; display:block;">ATENDIDOS</span>
        <strong style="font-size:1.4rem; color:#063D25; font-family:'Outfit';">${atendidos}</strong>
        <span style="font-size:0.68rem; color:#64748B; display:block;">Vehículos</span>
      </div>

      <div style="background:#EFF6FF; border:1px solid #93C5FD; border-radius:6px; padding:0.75rem; text-align:center;">
        <span style="font-size:0.7rem; color:#1D4ED8; font-weight:700; display:block;">WALK-INS</span>
        <strong style="font-size:1.4rem; color:#1E40AF; font-family:'Outfit';">${walkins}</strong>
        <span style="font-size:0.68rem; color:#64748B; display:block;">Ingresos Garita</span>
      </div>

      <div style="background:#FEF2F2; border:1px solid #FCA5A5; border-radius:6px; padding:0.75rem; text-align:center;">
        <span style="font-size:0.7rem; color:#B91C1C; font-weight:700; display:block;">CON MULTA</span>
        <strong style="font-size:1.4rem; color:#991B1B; font-family:'Outfit';">${multas}</strong>
        <span style="font-size:0.68rem; color:#64748B; display:block;">Recargos Mora</span>
      </div>

      <div style="background:#ECFDF5; border:1px solid #6EE7B7; border-radius:6px; padding:0.75rem; text-align:center;">
        <span style="font-size:0.7rem; color:#047857; font-weight:700; display:block;">RECAUDACIÓN</span>
        <strong style="font-size:1.3rem; color:#065F46; font-family:'Outfit';">Bs. ${recaudacionTotal.toFixed(2)}</strong>
        <span style="font-size:0.68rem; color:#64748B; display:block;">${periodName}</span>
      </div>
    </div>

    <!-- Desglose Métodos de Pago -->
    <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:6px; padding:0.9rem; margin-bottom:1.2rem;">
      <h4 style="margin:0 0 0.6rem 0; font-size:0.88rem; color:#0F172A;"><i class="fa-solid fa-wallet text-emerald"></i> Desglose de Recaudación en Caja por Método de Pago</h4>
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem; font-size:0.85rem;">
        <div style="background:#F8FAFC; padding:0.6rem; border-radius:4px; border:1px solid #CBD5E1;">
          <span style="color:#64748B; font-size:0.75rem;">💵 Efectivo Recibido:</span>
          <div style="font-weight:800; color:#1E293B; font-size:1.05rem;">Bs. ${efec.toFixed(2)}</div>
        </div>

        <div style="background:#F8FAFC; padding:0.6rem; border-radius:4px; border:1px solid #CBD5E1;">
          <span style="color:#64748B; font-size:0.75rem;">📱 QR Simbol / Banco:</span>
          <div style="font-weight:800; color:#1E293B; font-size:1.05rem;">Bs. ${qr.toFixed(2)}</div>
        </div>

        <div style="background:#F8FAFC; padding:0.6rem; border-radius:4px; border:1px solid #CBD5E1;">
          <span style="color:#64748B; font-size:0.75rem;">💳 Tarjeta Débito/Crédito:</span>
          <div style="font-weight:800; color:#1E293B; font-size:1.05rem;">Bs. ${tarj.toFixed(2)}</div>
        </div>
      </div>
    </div>

    <!-- Ultimas transacciones procesadas por este operador -->
    <div>
      <h4 style="margin:0 0 0.5rem 0; font-size:0.85rem; color:#0F172A;"><i class="fa-solid fa-receipt text-emerald"></i> Movimientos Recientes Auditados</h4>
      <table class="data-table" style="font-size:0.78rem;">
        <thead>
          <tr style="background:#F8FAFC;">
            <th>TICKET</th>
            <th>HORA</th>
            <th>PLACA</th>
            <th>MODALIDAD</th>
            <th>MONTO</th>
            <th>ESTADO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:700; font-family:'Outfit';">#WALK-8812</td>
            <td>09:15 AM</td>
            <td style="font-weight:800;">7849-XYZ</td>
            <td>Walk-In 2 Hrs</td>
            <td style="font-weight:700; color:#006D36;">Bs. 20.00</td>
            <td><span class="badge badge-success" style="font-size:0.65rem;">Cobrado</span></td>
          </tr>
          <tr>
            <td style="font-weight:700; font-family:'Outfit';">#RES-9041</td>
            <td>08:05 AM</td>
            <td style="font-weight:800;">ABC-1234</td>
            <td>Reserva Web</td>
            <td style="font-weight:700; color:#006D36;">Bs. 40.00</td>
            <td><span class="badge badge-success" style="font-size:0.65rem;">Cobrado</span></td>
          </tr>
          <tr>
            <td style="font-weight:700; font-family:'Outfit';">#WALK-7741</td>
            <td>07:30 AM</td>
            <td style="font-weight:800;">8821-EXP</td>
            <td>Walk-In + Mora 30m</td>
            <td style="font-weight:700; color:#DC2626;">Bs. 35.00</td>
            <td><span class="badge badge-danger" style="font-size:0.65rem;">Con Recargo</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}
