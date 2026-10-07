import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// TU CATÁLOGO ESTÁTICO DE PERMISOS
const PERMISSIONS = [
    'CREATE_ROLE',
    'UPDATE_ROLE',
    'DELETE_ROLE',
];

async function main() {
    console.log('🌱 Iniciando seeder de permisos...');

    for (const permissionName of PERMISSIONS) {
        await prisma.permission.upsert({
            where: { name: permissionName }, // Si ya existe el permiso...
            update: {},                      // ...no hace nada.
            create: { name: permissionName } // ...si no existe, lo crea.
        });
    }

    console.log('✅ Permisos insertados correctamente.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
