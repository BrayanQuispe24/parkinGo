import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SEED_TERMINOS = [
  {
    title: '1. Aceptación y Alcance de los Términos',
    content: 'Al registrarse y utilizar la plataforma ParkinGo, el usuario acepta de forma plena e incondicional los presentes Términos y Condiciones. Este acuerdo regula el acceso a los servicios de búsqueda, reserva, alquiler y gestión de espacios de estacionamiento en el territorio boliviano.',
    order: 1,
    isActive: true,
    version: '1.0'
  },
  {
    title: '2. Registro, Veracidad y Seguridad de la Cuenta',
    content: 'El usuario se compromete a proporcionar información fidedigna, completa y actualizada durante el registro (nombre, documento de identidad, correo y teléfono). Las credenciales de acceso son de carácter personal e intransferible. El usuario es el único responsable de la confidencialidad de su contraseña y de las actividades realizadas bajo su cuenta.',
    order: 2,
    isActive: true,
    version: '1.0'
  },
  {
    title: '3. Roles y Responsabilidades de los Usuarios',
    content: 'ParkinGo conecta a conductores (usuarios que buscan estacionamiento), anfitriones particulares (dueños de espacios) y administradores de parqueos comerciales. Cada usuario se compromete a respetar las normas de convivencia, los horarios de reserva pactados y las instrucciones específicas del recinto de parqueo.',
    order: 3,
    isActive: true,
    version: '1.0'
  },
  {
    title: '4. Reservas, Tarifas y Políticas de Pago',
    content: 'Los precios de los parqueos son definidos de acuerdo a las modalidades por hora, día o mensualidad. Al confirmar una reserva, el conductor autoriza el débito o cobro del importe correspondiente según los métodos de pago habilitados en la plataforma. Las tarifas incluyen los impuestos de ley aplicables.',
    order: 4,
    isActive: true,
    version: '1.0'
  },
  {
    title: '5. Cancelaciones, Tolerancias y Reembolsos',
    content: 'Las cancelaciones realizadas con la debida anticipación conforme a las políticas del parqueo seleccionado podrán ser sujetas a reembolso o saldo a favor. Se establece un margen de tolerancia para el ingreso; superado dicho tiempo sin notificación previa, el anfitrión o parqueo podrá liberar la plaza reservada.',
    order: 5,
    isActive: true,
    version: '1.0'
  },
  {
    title: '6. Cuidado y Responsabilidad de Vehículos y Bienes',
    content: 'ParkinGo opera como un intermediario tecnológico para la gestión y reserva de plazas. El cuidado, vigilancia directa y resguardo físico de los vehículos corresponden a las medidas de seguridad del parqueo o anfitrión contratado. Se prohíbe dejar artículos prohibidos o sustancias ilícitas dentro de las instalaciones.',
    order: 6,
    isActive: true,
    version: '1.0'
  },
  {
    title: '7. Privacidad y Protección de Datos Personales',
    content: 'La recolección y tratamiento de datos personales se rige por la Política de Privacidad de ParkinGo y la legislación vigente en Bolivia. Los datos serán utilizados exclusivamente para la prestación, facturación, seguridad y mejora continua de los servicios de la plataforma.',
    order: 7,
    isActive: true,
    version: '1.0'
  },
  {
    title: '8. Modificaciones de los Términos y Jurisdicción',
    content: 'ParkinGo se reserva el derecho de actualizar los presentes Términos y Condiciones en cualquier momento. Cualquier cambio significativo será notificado en la plataforma y requerirá la conformidad del usuario para continuar operando. Cualquier controversia será resuelta bajo la jurisdicción de los tribunales de Santa Cruz de la Sierra, Bolivia.',
    order: 8,
    isActive: true,
    version: '1.0'
  }
];

async function main() {
  console.log('Iniciando seeder de Términos y Condiciones...');

  for (const item of SEED_TERMINOS) {
    const existing = await prisma.terminoCondicion.findFirst({
      where: { title: item.title, version: item.version }
    });

    if (!existing) {
      await prisma.terminoCondicion.create({
        data: item
      });
      console.log(`Creado: ${item.title}`);
    } else {
      await prisma.terminoCondicion.update({
        where: { id: existing.id },
        data: {
          content: item.content,
          order: item.order,
          isActive: item.isActive
        }
      });
      console.log(`Actualizado: ${item.title}`);
    }
  }

  console.log(' Seeder de Términos y Condiciones completado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error en seeder de términos y condiciones:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
