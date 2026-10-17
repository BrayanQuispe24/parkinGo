import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ROLES = [
    'HOST',
    'PARKING_ADMIN',
    'DRIVER',
    'GENERAL_ADMIN',
    'SUPER_ADMIN',
    'PARKING_OPERATOR'
];

async function main() {
    console.log('🌱 Iniciando seeder de roles...');

    for (const roleName of ROLES) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName }
        });
        console.log(`✅ Rol ${roleName} asegurado en la base de datos.`);
    }

    console.log('✅ Seeder de roles completado.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
