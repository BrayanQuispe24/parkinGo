import 'dotenv/config';
import { execSync } from 'child_process';

console.log('🌱 Ejecutando todos los seeders de ParkinGo...');

try {
    console.log('\n--- 1. Seeder de Roles ---');
    execSync('npx tsx ./prisma/seeders/roles.seeder.ts', { stdio: 'inherit' });

    console.log('\n--- 2. Seeder de Permisos ---');
    execSync('npx tsx ./prisma/seeders/permissions.seeder.ts', { stdio: 'inherit' });

    console.log('\n--- 3. Seeder de Términos y Condiciones ---');
    execSync('npx tsx ./prisma/seeders/terminos-condiciones.seeder.ts', { stdio: 'inherit' });

    console.log('\n🚀 Todos los seeders se ejecutaron exitosamente.');
} catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    process.exit(1);
}
