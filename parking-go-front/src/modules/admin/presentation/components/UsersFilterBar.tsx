// src/modules/admin/presentation/components/UsersFilterBar.tsx

interface UsersFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    selectedRole: string;
    onRoleChange: (value: string) => void;
    selectedStatus: string;
    onStatusChange: (value: string) => void;
}

export const UsersFilterBar = ({
    search,
    onSearchChange,
    selectedRole,
    onRoleChange,
    selectedStatus,
    onStatusChange,
}: UsersFilterBarProps) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.85rem',
                marginBottom: '1rem',
                flexWrap: 'wrap',
            }}
        >
            {/* Input de Búsqueda */}
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                <i
                    className="fa-solid fa-magnifying-glass"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}
                ></i>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar por nombre, correo, empresa o rol..."
                    style={{
                        width: '100%',
                        padding: '0.5rem 0.85rem 0.5rem 2.4rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.82rem',
                        outline: 'none',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    }}
                />
            </div>

            {/* Selectores de Filtro */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <select
                    value={selectedRole}
                    onChange={(e) => onRoleChange(e.target.value)}
                    style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: '#1e293b',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    <option value="">Todos los Roles</option>
                    <option value="HOST">Dueño de Empresa / Host</option>
                    <option value="PARKING_ADMIN">Administrador de Parqueo</option>
                    <option value="DRIVER">Conductor</option>
                    <option value="SUPER_ADMIN">Super Administrador</option>
                </select>

                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: '#1e293b',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    <option value="">Todos los Estados</option>
                    <option value="ACTIVE">Activo</option>
                    <option value="SUSPENDED">Suspendido</option>
                    <option value="INACTIVE">Inactivo</option>
                </select>
            </div>
        </div>
    );
};
