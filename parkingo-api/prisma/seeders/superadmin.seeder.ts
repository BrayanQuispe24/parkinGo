import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seeder de SuperAdmin...');

    // 1. Obtener el rol SUPER_ADMIN
    const role = await prisma.role.findUnique({
        where: { name: 'SUPER_ADMIN' }
    });

    if (!role) {
        throw new Error('❌ El rol SUPER_ADMIN no existe. Ejecuta el seeder de roles primero.');
    }

    const email = 'admin@parkingo.com';
    const plainPassword = 'password123'; // Contraseña por defecto
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 2. Crear o actualizar el usuario
    await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword, // Actualiza la contraseña por si se olvidó
            roleId: role.id,
        },
        create: {
            email,
            password: hashedPassword,
            firstName: 'Super',
            lastName: 'Admin',
            ci: '0000000',
            roleId: role.id,
            status: 'ACTIVE'
        }
    });

    console.log(`✅ SuperAdmin asegurado exitosamente en la base de datos.`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Contraseña: ${plainPassword}`);
    console.log(`⚠️  (Se recomienda cambiar esta contraseña en producción)`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
