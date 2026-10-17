// src/modules/auth/infrastructure/HttpTermsRepository.ts
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { TermItem, TermsRepository } from '../domain/TermItem';

const DEFAULT_TERMS: TermItem[] = [
    {
        id: 1,
        title: '1. Aceptación de los Términos del Servicio',
        content:
            'Al registrarse en la plataforma ParkinGo, el usuario acepta de forma plena y sin reservas todos los términos, condiciones y políticas vigentes para el territorio de Bolivia. Si no está de acuerdo con alguno de ellos, debe abstenerse de utilizar el servicio.',
        order: 1,
        isActive: true,
    },
    {
        id: 2,
        title: '2. Responsabilidades y Uso de la Cuenta',
        content:
            'El usuario es el único responsable de la veracidad de los datos personales (Nombre, Carnet de Identidad y Teléfono) y de salvaguardar sus credenciales de acceso. Queda prohibido el uso no autorizado o fraudulento de cuentas.',
        order: 2,
        isActive: true,
    },
    {
        id: 3,
        title: '3. Roles de Conductor, Anfitrión y Administrador',
        content:
            'Los Conductores se comprometen a respetar los horarios y normas del parqueo reservado. Los Anfitriones y Administradores garantizan la disponibilidad real y seguridad física de los cupos publicados en la red.',
        order: 3,
        isActive: true,
    },
    {
        id: 4,
        title: '4. Pagos, Tarifas y Comisiones',
        content:
            'Todas las transacciones en moneda nacional (Bolivianos - Bs.) están sujetas a las tarifas de reserva y comisiones por intermediación acordadas según el plan contratado. No se realizan reembolsos por ausencias injustificadas.',
        order: 4,
        isActive: true,
    },
    {
        id: 5,
        title: '5. Privacidad y Protección de Datos',
        content:
            'ParkinGo se compromete a no comercializar ni divulgar datos confidenciales a terceros ajenos a la prestación y verificación del servicio de estacionamiento.',
        order: 5,
        isActive: true,
    },
];

export class HttpTermsRepository implements TermsRepository {
    async getTerms(): Promise<TermItem[]> {
        try {
            const response = await parkingoApi.get<TermItem[] | { data: TermItem[] }>('/configuracion/terminos-condiciones');
            if (response.data) {
                if (Array.isArray(response.data)) {
                    return response.data;
                }
                if ('data' in response.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                }
            }
            return DEFAULT_TERMS;
        } catch (error) {
            console.error('Error al conectar con la base de datos para obtener términos y condiciones:', error);
            return DEFAULT_TERMS;
        }
    }
}

export const termsRepository = new HttpTermsRepository();
