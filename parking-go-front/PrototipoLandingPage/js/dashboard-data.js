/* ==========================================================================
   DASHBOARD MOCK DATA ENGINE
   Contains state and data structures for all 8 administrative modules
   ========================================================================== */

const MockData = {
  // 1. KPI Stats & Analytics
  stats: {
    totalRevenueCommissions: 48290.50, // Bs.
    totalRevenueServiceFees: 14350.00, // Bs.
    totalRegisteredUsers: 1420,
    totalParkingAdmins: 95,
    totalActiveParkings: 48,
    totalPublishedSlots: 4250,
    totalReservations: 38420,
    globalOccupancyRate: 78.4,
    monthlyCommissionRate: 8.5, // %
    driverServiceFee: 2.50, // Bs.
    subscribedPlans: { Enterprise: 12, Pro: 24, Basico: 9 }
  },

  // Configuración General de la Plataforma
  platformConfig: {
    platformName: "ParkinGo Enterprise Platform",
    currencySymbol: "Bs.",
    currencyCode: "BOB",
    guaranteedSla: "99.9%",
    maintenanceMode: false,
    supportEmail: "soporte@parkingo.bo",
    supportPhone: "+591 800 10 9900",
    driverServiceFee: 2.50
  },

  chartData: {
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
    incomeData: [12400, 15800, 18200, 21000, 24500, 29000, 34200, 41000, 48290],
    transactionsData: [11200, 14100, 16800, 19500, 22100, 26400, 31000, 35600, 38420]
  },

  // 2. System Users (Dueños de Empresa, Administradores de Parqueo, Conductores)
  users: [
    {
      id: 1,
      name: "Carlos Mendoza",
      role: "Dueño de Empresa",
      company: "Estacionamientos del Norte S.A.",
      email: "carlos.mendoza@estacionort.com",
      phone: "+591 710 49128",
      status: "Activo",
      parkingsCount: 5,
      joinedDate: "2024-03-15"
    },
    {
      id: 2,
      name: "Valeria Gómez",
      role: "Administrador de Parqueo",
      company: "Parkings Centrales Express",
      email: "v.gomez@parkingscentrales.com",
      phone: "+591 721 92813",
      status: "Activo",
      parkingsCount: 8,
      joinedDate: "2024-01-10"
    },
    {
      id: 3,
      name: "Roberto Silva",
      role: "Conductor",
      company: "Usuario Particular",
      email: "roberto.silva@gmail.com",
      phone: "+591 733 10294",
      status: "Activo",
      parkingsCount: 0,
      joinedDate: "2024-05-20"
    },
    {
      id: 4,
      name: "Mariana Alarcón",
      role: "Dueño de Empresa",
      company: "Estaciones Urbanas VIP",
      email: "malarcon@urbanvip.com",
      phone: "+591 755 88291",
      status: "Suspendido",
      parkingsCount: 2,
      joinedDate: "2024-02-01"
    },
    {
      id: 5,
      name: "Fernando Ruiz",
      role: "Administrador de Parqueo",
      company: "Soluciones de Parqueo Bajío",
      email: "fruiz@parqueobajio.com",
      phone: "+591 744 23910",
      status: "Activo",
      parkingsCount: 6,
      joinedDate: "2024-06-12"
    },
    {
      id: 6,
      name: "Sofia Justiniano",
      role: "Conductor",
      company: "Usuario Particular",
      email: "s.justiniano@hotmail.com",
      phone: "+591 772 81920",
      status: "Activo",
      parkingsCount: 0,
      joinedDate: "2024-07-04"
    }
  ],

  // 3. Roles and Permissions Matrix
  roles: ["Administrador General", "Dueño de Empresa", "Administrador de Parqueo", "Operador de Parqueo", "Conductor"],
  selectedRole: "Administrador General",
  permissionsByRole: {
    "Administrador General": [
      { module: "Gestión de Usuarios", read: true, create: true, edit: true, delete: true },
      { module: "Gestión de Parqueos", read: true, create: true, edit: true, delete: true },
      { module: "Planes y Suscripciones", read: true, create: true, edit: true, delete: true },
      { module: "Comisiones y Liquidaciones", read: true, create: true, edit: true, delete: true },
      { module: "Promociones Globales", read: true, create: true, edit: true, delete: true },
      { module: "Bitácora de Auditoría", read: true, create: false, edit: false, delete: false }
    ],
    "Dueño de Empresa": [
      { module: "Gestión de Usuarios", read: true, create: true, edit: true, delete: false },
      { module: "Gestión de Parqueos", read: true, create: true, edit: true, delete: true },
      { module: "Planes y Suscripciones", read: true, create: false, edit: true, delete: false },
      { module: "Comisiones y Liquidaciones", read: true, create: false, edit: false, delete: false },
      { module: "Promociones Globales", read: true, create: true, edit: true, delete: false },
      { module: "Bitácora de Auditoría", read: true, create: false, edit: false, delete: false }
    ],
    "Administrador de Parqueo": [
      { module: "Gestión de Usuarios", read: true, create: true, edit: true, delete: false },
      { module: "Gestión de Parqueos", read: true, create: true, edit: true, delete: false },
      { module: "Planes y Suscripciones", read: true, create: false, edit: false, delete: false },
      { module: "Comisiones y Liquidaciones", read: true, create: false, edit: false, delete: false },
      { module: "Promociones Globales", read: true, create: true, edit: true, delete: false },
      { module: "Bitácora de Auditoría", read: false, create: false, edit: false, delete: false }
    ],
    "Operador de Parqueo": [
      { module: "Gestión de Usuarios", read: false, create: false, edit: false, delete: false },
      { module: "Gestión de Parqueos", read: true, create: false, edit: true, delete: false },
      { module: "Planes y Suscripciones", read: false, create: false, edit: false, delete: false },
      { module: "Comisiones y Liquidaciones", read: false, create: false, edit: false, delete: false },
      { module: "Promociones Globales", read: true, create: false, edit: false, delete: false },
      { module: "Bitácora de Auditoría", read: false, create: false, edit: false, delete: false }
    ],
    "Conductor": [
      { module: "Gestión de Usuarios", read: false, create: false, edit: false, delete: false },
      { module: "Gestión de Parqueos", read: true, create: false, edit: false, delete: false },
      { module: "Planes y Suscripciones", read: false, create: false, edit: false, delete: false },
      { module: "Comisiones y Liquidaciones", read: false, create: false, edit: false, delete: false },
      { module: "Promociones Globales", read: true, create: false, edit: false, delete: false },
      { module: "Bitácora de Auditoría", read: false, create: false, edit: false, delete: false }
    ]
  },

  // 4. Parking Registration Requests (Solicitudes de alta de administradores de parqueo)
  parkingRequests: [
    {
      id: "SOL-2026-001",
      parkingName: "Parqueo Plaza Principal Calama",
      applicantName: "Ing. Marco Aurelio Prado",
      applicantRole: "Administrador de Parqueo",
      company: "Estacionamientos Calama S.R.L.",
      email: "m.prado@calamaparking.bo",
      phone: "+591 712 88492",
      city: "Cochabamba",
      address: "Calle Calama #450, Zona Central",
      totalSlots: 85,
      hourlyRate: 10.00,
      taxId: "NIT 3819201029",
      legalDocs: "Licencia de Funcionamiento 2026, Certificado NIT, Registro Fundempresa",
      requestDate: "2026-09-07 14:30",
      status: "Pendiente",
      notes: "Registro de nuevo estacionamiento céntrico. Incluye barrera electrónica de control."
    },
    {
      id: "SOL-2026-002",
      parkingName: "Garaje Express San Martín",
      applicantName: "Lucía Fernández",
      applicantRole: "Administrador de Parqueo",
      company: "Servicios de Parqueo San Martín",
      email: "l.fernandez@sanmartin.bo",
      phone: "+591 765 43210",
      city: "Santa Cruz",
      address: "Av. San Martín #120, Equipetrol",
      totalSlots: 120,
      hourlyRate: 15.00,
      taxId: "NIT 5920194018",
      legalDocs: "Licencia de Funcionamiento 2026, Certificado RUAT Municipal",
      requestDate: "2026-09-06 09:15",
      status: "Pendiente",
      notes: "Solicitud de alta para parqueo comercial con sensores ultrasónicos en plaza."
    },
    {
      id: "SOL-2026-003",
      parkingName: "Parqueo Aeropuerto El Alto VIP",
      applicantName: "Gonzalo Vargas",
      applicantRole: "Administrador de Parqueo",
      company: "Aeroparqueos Bolivia Corp.",
      email: "gvargas@aeroparqueos.bo",
      phone: "+591 778 99123",
      city: "La Paz",
      address: "Av. Héroes del Km 7, El Alto",
      totalSlots: 200,
      hourlyRate: 12.00,
      taxId: "NIT 1029384756",
      legalDocs: "Licencia Municipal La Paz, Certificación de Seguridad contra Incendios",
      requestDate: "2026-09-05 18:45",
      status: "Pendiente",
      notes: "Estacionamiento privado con cámaras LPR para reconocimiento de matrículas."
    },
    {
      id: "SOL-2026-004",
      parkingName: "Estacionamiento Paseo Aranjuez",
      applicantName: "Valeria Gómez",
      applicantRole: "Administrador de Parqueo",
      company: "Parkings Centrales Express",
      email: "v.gomez@parkingscentrales.com",
      phone: "+591 721 92813",
      city: "Cochabamba",
      address: "Av. América E-0150",
      totalSlots: 60,
      hourlyRate: 8.00,
      taxId: "NIT 7712398012",
      legalDocs: "Licencia Municipal 2025-2026",
      requestDate: "2026-09-02 11:20",
      status: "Aprobado",
      notes: "Aprobado tras verificación presencial de señalización y facturación fiscal."
    },
    {
      id: "SOL-2026-005",
      parkingName: "Estacionamiento Mercado Mutualista",
      applicantName: "Héctor Zabala",
      applicantRole: "Administrador de Parqueo",
      company: "Servicios Zabala Hnos.",
      email: "hzabala@mutualista.bo",
      phone: "+591 713 00291",
      city: "Santa Cruz",
      address: "3er Anillo Interno, Mercado Mutualista",
      totalSlots: 90,
      hourlyRate: 7.00,
      taxId: "NIT 4920194810",
      legalDocs: "Licencia Municipal 2024 (Pendiente Actualización 2026)",
      requestDate: "2026-09-01 10:00",
      status: "Observado",
      notes: "Observación de Admin: La Licencia de Funcionamiento adjunta corresponde a la gestión 2024. Se requiere adjuntar la renovación 2026 vigente."
    }
  ],

  // 5. Parking Lots (Sucursales Activas)
  parkings: [
    {
      id: 101,
      name: "Parqueo Centro Histórico",
      owner: "Parkings Centrales Express",
      city: "Ciudad de México",
      address: "Av. Juárez 42, Centro",
      totalSlots: 150,
      availableSlots: 22,
      status: "Operativo",
      occupancy: 85.3
    },
    {
      id: 102,
      name: "Plaza San Pedro Garage",
      owner: "Estacionamientos del Norte S.A.",
      city: "Monterrey",
      address: "Calzada del Valle 401",
      totalSlots: 220,
      availableSlots: 95,
      status: "Operativo",
      occupancy: 56.8
    },
    {
      id: 103,
      name: "AutoPark Guadalajara Expo",
      owner: "AutoPark Metropolitana",
      city: "Guadalajara",
      address: "Av. Mariano Otero 1499",
      totalSlots: 300,
      availableSlots: 8,
      status: "Lleno",
      occupancy: 97.3
    },
    {
      id: 104,
      name: "Estación Querétaro Antea",
      owner: "Soluciones de Parqueo Bajío",
      city: "Querétaro",
      address: "Paseo de la República 111",
      totalSlots: 180,
      availableSlots: 0,
      status: "Mantenimiento",
      occupancy: 100.0
    },
    {
      id: 105,
      name: "VIP Aeropuerto Terminal 1",
      owner: "Estaciones Urbanas VIP",
      city: "Ciudad de México",
      address: "Av. Capitán Carlos León s/n",
      totalSlots: 400,
      availableSlots: 110,
      status: "Operativo",
      occupancy: 72.5
    }
  ],

  // 5. Subscription Plans
  plans: [
    {
      id: "basic",
      name: "Plan Básico",
      priceMonth: 49,
      priceYear: 490,
      parkingLimit: 2,
      transactionLimit: "5,000 / mes",
      features: [
        "Hasta 2 Sucursales",
        "Control de accesos estándar",
        "Soporte vía Email",
        "Reportes básicos"
      ],
      popular: false
    },
    {
      id: "pro",
      name: "Plan Profesional",
      priceMonth: 129,
      priceYear: 1290,
      parkingLimit: 10,
      transactionLimit: "25,000 / mes",
      features: [
        "Hasta 10 Sucursales",
        "Integración con cámaras LPR",
        "Matriz de permisos de operador",
        "Soporte Prioritario 24/7",
        "Analíticas en tiempo real"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Plan Empresarial",
      priceMonth: 299,
      priceYear: 2990,
      parkingLimit: "Ilimitado",
      transactionLimit: "Ilimitadas",
      features: [
        "Sucursales ilimitadas",
        "API personalizada e integraciones",
        "Gerente de cuenta dedicado",
        "Comisión preferencial reducida",
        "Auditoría SLA garantizada"
      ],
      popular: false
    }
  ],

  // 6. Commissions & Settlements
  settlements: [
    {
      id: "SET-9012",
      ownerCompany: "Parkings Centrales Express",
      grossAmount: 18450.00,
      commissionAmount: 1568.25, // 8.5%
      netPayout: 16881.75,
      status: "Pagado",
      date: "2026-09-01"
    },
    {
      id: "SET-9013",
      ownerCompany: "Estacionamientos del Norte S.A.",
      grossAmount: 24100.00,
      commissionAmount: 2048.50,
      netPayout: 22051.50,
      status: "Pendiente",
      date: "2026-09-05"
    },
    {
      id: "SET-9014",
      ownerCompany: "AutoPark Metropolitana",
      grossAmount: 12900.00,
      commissionAmount: 1096.50,
      netPayout: 11803.50,
      status: "Pagado",
      date: "2026-08-28"
    }
  ],

  // 7. System Promotions & Coupons
  promotions: [
    {
      id: "PROM-1",
      code: "PARK2026",
      type: "Porcentaje",
      discount: "15%",
      startDate: "2026-09-01",
      endDate: "2026-09-30",
      usedCount: 342,
      maxLimit: 1000,
      status: "Activo"
    },
    {
      id: "PROM-2",
      code: "BIENVENIDA50",
      type: "Monto Fijo",
      discount: "$50 MXN",
      startDate: "2026-08-15",
      endDate: "2026-10-15",
      usedCount: 500,
      maxLimit: 500,
      status: "Agotado"
    },
    {
      id: "PROM-3",
      code: "EXPO-GDL",
      type: "Porcentaje",
      discount: "20%",
      startDate: "2026-09-10",
      endDate: "2026-09-20",
      usedCount: 18,
      maxLimit: 200,
      status: "Activo"
    }
  ],

  // 8. Audit Log
  auditLogs: [
    {
      id: "LOG-881",
      timestamp: "2026-09-08 09:42:10",
      user: "Admin General (Tú)",
      role: "SuperAdmin",
      action: "Cambio de Comisión",
      module: "Comisiones",
      ip: "189.201.42.10"
    },
    {
      id: "LOG-880",
      timestamp: "2026-09-08 08:15:33",
      user: "Carlos Mendoza",
      role: "Dueño",
      action: "Alta de Sucursal",
      module: "Parqueos",
      ip: "201.149.88.5"
    },
    {
      id: "LOG-879",
      timestamp: "2026-09-07 18:22:45",
      user: "Soporte Técnico",
      role: "Soporte",
      action: "Modificación de Permisos",
      module: "Roles & Permisos",
      ip: "187.189.12.9"
    },
    {
      id: "LOG-878",
      timestamp: "2026-09-07 14:05:12",
      user: "Admin General (Tú)",
      role: "SuperAdmin",
      action: "Creación de Cupón PARK2026",
      module: "Promociones",
      ip: "189.201.42.10"
    },
    {
      id: "LOG-877",
      timestamp: "2026-09-06 11:30:00",
      user: "Mariana Alarcón",
      role: "Dueño",
      action: "Suspensión de Cuenta",
      module: "Usuarios",
      ip: "189.155.03.1"
    }
  ],

  // 9. Backups Engine
  backups: [
    {
      id: "BKP-20260908-0400",
      timestamp: "2026-09-08 04:00:00",
      type: "Automática",
      size: "248.5 MB",
      format: ".sql.gz",
      encryption: "AES-256",
      status: "Completado"
    },
    {
      id: "BKP-20260907-0400",
      timestamp: "2026-09-07 04:00:00",
      type: "Automática",
      size: "245.1 MB",
      format: ".sql.gz",
      encryption: "AES-256",
      status: "Completado"
    },
    {
      id: "BKP-20260906-1630",
      timestamp: "2026-09-06 16:30:15",
      type: "Manual",
      size: "241.8 MB",
      format: ".json.tar",
      encryption: "AES-256",
      status: "Completado"
    },
    {
      id: "BKP-20260905-0400",
      timestamp: "2026-09-05 04:00:00",
      type: "Automática",
      size: "239.0 MB",
      format: ".sql.gz",
      encryption: "AES-256",
      status: "Completado"
    }
  ],

  // 9. Calificaciones, Denuncias y Reportes de Parqueos
  incidents: [
    {
      id: "DEN-2026-089",
      parkingId: 101,
      parkingName: "Parqueo Centro Histórico",
      complainantName: "Juan Pablo Vargas",
      complainantRole: "Conductor",
      category: "Cobro Indebido",
      severity: "Alta",
      description: "El parqueo cobró 2 horas adicionales aduciendo falla de sistema en la barrera de salida.",
      date: "2026-09-07 16:45",
      status: "En Investigación",
      notes: "Notificación enviada al dueño de empresa para descargo en 24 horas."
    },
    {
      id: "DEN-2026-088",
      parkingId: 102,
      parkingName: "Plaza San Pedro Garage",
      complainantName: "Elena Rostagno",
      complainantRole: "Conductor",
      category: "Instalaciones Defectuosas",
      severity: "Media",
      description: "Falta de iluminación en el subsuelo 2 y sensores de plaza apagados.",
      date: "2026-09-06 11:20",
      status: "Pendiente",
      notes: "Generado vía app por usuario."
    },
    {
      id: "DEN-2026-087",
      parkingId: 103,
      parkingName: "Estacionamiento Paseo Aranjuez",
      complainantName: "Carlos Terrazas",
      complainantRole: "Conductor",
      category: "Trato Inadecuado",
      severity: "Baja",
      description: "Personal de barrera mostró actitud descortés al solicitar la factura fiscal.",
      date: "2026-09-04 19:10",
      status: "Resuelto",
      notes: "El dueño de la empresa envió disculpa formal y comprobante de resolución."
    }
  ]
};
