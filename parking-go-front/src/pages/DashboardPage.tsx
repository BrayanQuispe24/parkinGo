// src/pages/DashboardPage.tsx
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

export const DashboardPage = () => {
    const { user, logoutState } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutState();
        navigate('/auth?mode=login');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6">
            <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
                            {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {user?.fullname || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Panel de Usuario'}
                            </h2>
                            <p className="text-sm text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {user?.role || 'DRIVER'}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-xs">C.I. / Documento</span>
                        <span className="font-medium text-slate-200">{user?.ci || 'No registrado'}</span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-xs">Género</span>
                        <span className="font-medium text-slate-200">{user?.gender || user?.sexo || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 col-span-2">
                        <span className="text-slate-400 block text-xs">Estado de Sesión</span>
                        <span className="text-emerald-400 font-medium">Autenticado con JWT en NestJS API</span>
                    </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-colors text-center"
                    >
                        Ir al Inicio
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-colors text-center"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};
export default DashboardPage;
