// src/modules/admin/presentation/components/UserStatusConfirmModal.tsx
import React from 'react';
import type { AdminUser } from '../../domain/AdminUser';

interface UserStatusConfirmModalProps {
    isOpen: boolean;
    user: AdminUser | null;
    isUpdating: boolean;
    onConfirm: () => Promise<void>;
    onClose: () => void;
}

export const UserStatusConfirmModal: React.FC<UserStatusConfirmModalProps> = ({
    isOpen,
    user,
    isUpdating,
    onConfirm,
    onClose,
}) => {
    if (!isOpen || !user) return null;

    const isSuspending = user.status === 'ACTIVE';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-[#DDE3DE] rounded-[4px] shadow-2xl w-full max-w-md p-5 text-[#17211B] space-y-4">
                {/* Header Peligro / Advertencia */}
                <div
                    className={`flex items-center gap-3 ${
                        isSuspending ? 'text-[#DC2626]' : 'text-[#006D36]'
                    }`}
                >
                    <div
                        className={`p-2.5 rounded-[4px] ${
                            isSuspending
                                ? 'bg-[#FEF2F2] border border-[#FECACA]'
                                : 'bg-[#F0FDF4] border border-[#BBF7D0]'
                        }`}
                    >
                        <i className={`fa-solid ${isSuspending ? 'fa-ban' : 'fa-check'} text-base`}></i>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-[#17211B] uppercase tracking-wider">
                            {isSuspending ? 'Suspender Acceso de Usuario' : 'Reactivar Cuenta de Usuario'}
                        </h3>
                        <p className="text-[11px] text-[#66736B] font-mono mt-0.5">
                            {isSuspending
                                ? 'El usuario no podrá iniciar sesión en la plataforma.'
                                : 'El usuario recuperará acceso inmediato a sus funciones.'}
                        </p>
                    </div>
                </div>

                {/* Mensaje descriptivo */}
                <p className="text-xs text-[#4A5E52] leading-relaxed">
                    ¿Confirmas que deseas {isSuspending ? 'suspender' : 'reactivar'} al usuario{' '}
                    <strong className="text-[#17211B] font-bold">
                        {user.fullname || user.email}
                    </strong>{' '}
                    con rol{' '}
                    <span className="font-mono text-[#006D36] font-bold">
                        {user.role?.name || 'USUARIO'}
                    </span>
                    ?
                </p>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DDE3DE]">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isUpdating}
                        className="px-3.5 py-1.5 rounded-[4px] border border-[#CBD5CE] bg-white text-[#4A5E52] text-xs font-semibold cursor-pointer hover:bg-[#F0F3EF] transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isUpdating}
                        className={`px-4 py-1.5 rounded-[4px] text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
                            isSuspending
                                ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                                : 'bg-[#006D36] hover:bg-[#00562B]'
                        }`}
                    >
                        {isUpdating && <i className="fa-solid fa-spinner fa-spin text-xs"></i>}
                        <span>{isSuspending ? 'Sí, Suspender Cuenta' : 'Sí, Activar Cuenta'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
