// src/modules/parking-admin/presentation/components/OperatorEnterpriseTable.tsx
import React, { useMemo, useState } from 'react';
import type { ParkingOperator } from '../../domain/ParkingOperator';

interface OperatorEnterpriseTableProps {
    operators: ParkingOperator[];
    loading?: boolean;
    onViewOperator: (op: ParkingOperator) => void;
    onEditOperator: (op: ParkingOperator) => void;
    onRequestToggleStatus: (op: ParkingOperator) => void;
    onDeleteOperator?: (op: ParkingOperator) => void;
}

export const OperatorEnterpriseTable: React.FC<OperatorEnterpriseTableProps> = ({
    operators,
    loading,
    onViewOperator,
    onEditOperator,
    onRequestToggleStatus,
    onDeleteOperator,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    // Filtrado reactivo en memoria
    const filteredOperators = useMemo(() => {
        return operators.filter((op) => {
            const matchesSearch =
                !searchTerm ||
                op.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                op.ci.toLowerCase().includes(searchTerm.toLowerCase()) ||
                op.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                op.phone.includes(searchTerm);

            const matchesStatus = selectedStatus === 'ALL' || op.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [operators, searchTerm, selectedStatus]);

    // Paginación
    const totalItems = filteredOperators.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const validCurrentPage = Math.min(currentPage, totalPages);
    const startRecord = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
    const endRecord = Math.min(validCurrentPage * pageSize, totalItems);

    const paginatedOperators = useMemo(() => {
        const start = (validCurrentPage - 1) * pageSize;
        return filteredOperators.slice(start, start + pageSize);
    }, [filteredOperators, validCurrentPage, pageSize]);

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
            {/* Toolbar Superior de Filtrado */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '300px', flexWrap: 'wrap' }}>
                    {/* Buscador */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '0.85rem' }}></i>
                        <input
                            type="text"
                            placeholder="Buscar operador por nombre, CI, teléfono o correo..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{
                                width: '100%',
                                padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                                fontSize: '0.84rem',
                                border: '1px solid var(--border-strong)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                borderRadius: '6px',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {/* Filtro Estado */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{ padding: '0.55rem 0.85rem', fontSize: '0.84rem', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
                    >
                        <option value="ALL">Todos los Estados</option>
                        <option value="en-sitio">En Turno Ahora</option>
                        <option value="activo">Solo Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Total: <strong style={{ color: 'var(--text-main)' }}>{totalItems}</strong> operador{totalItems === 1 ? '' : 'es'}
                </div>
            </div>

            {/* Tabla Principal para Pantallas Grandes (Desktop / Tablet horizontal) */}
            <div className="operator-table-desktop" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700 }}>OPERADOR</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>IDENTIFICACIÓN / CONTACTO</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>ESTADO</th>
                            <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                                    Cargando personal registrado...
                                </td>
                            </tr>
                        ) : paginatedOperators.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                                    <i className="fa-solid fa-users-slash" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                                    No se encontraron operadores registrados con los filtros aplicados.
                                </td>
                            </tr>
                        ) : (
                            paginatedOperators.map((op) => {
                                const isEnTurno = op.status === 'en-sitio';
                                const isActivo = op.status === 'activo';

                                return (
                                    <tr key={op.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        {/* OPERADOR */}
                                        <td style={{ padding: '0.85rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '50%',
                                                        background: 'var(--accent-emerald)',
                                                        color: '#FFFFFF',
                                                        fontWeight: 800,
                                                        fontSize: '0.85rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {op.avatarInitials}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                                                        {op.fullName}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        {op.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* CONTACTO */}
                                        <td style={{ padding: '0.85rem 1rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>CI: {op.ci}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                <i className="fa-solid fa-phone" style={{ fontSize: '0.7rem', marginRight: '0.25rem' }}></i>
                                                {op.phone}
                                            </div>
                                        </td>

                                        {/* ESTADO */}
                                        <td style={{ padding: '0.85rem 1rem' }}>
                                            {isEnTurno ? (
                                                <span
                                                    style={{
                                                        background: 'rgba(34, 197, 94, 0.12)',
                                                        color: '#22C55E',
                                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 800,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                    }}
                                                >
                                                    <span className="pulse-dot"></span> EN TURNO
                                                </span>
                                            ) : isActivo ? (
                                                <span
                                                    style={{
                                                        background: 'rgba(59, 130, 246, 0.12)',
                                                        color: '#3B82F6',
                                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    ACTIVO
                                                </span>
                                            ) : (
                                                <span
                                                    style={{
                                                        background: 'rgba(148, 163, 184, 0.15)',
                                                        color: 'var(--text-muted)',
                                                        border: '1px solid var(--border-subtle)',
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    INACTIVO
                                                </span>
                                            )}
                                        </td>

                                        {/* ACCIONES */}
                                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => onViewOperator(op)}
                                                    title="Ver reporte y métricas de desempeño"
                                                    style={{
                                                        background: 'var(--bg-primary)',
                                                        border: '1px solid var(--border-subtle)',
                                                        borderRadius: '4px',
                                                        padding: '0.35rem 0.6rem',
                                                        cursor: 'pointer',
                                                        color: 'var(--text-main)',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    <i className="fa-solid fa-chart-line"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onEditOperator(op)}
                                                    title="Editar datos del operador"
                                                    style={{
                                                        background: 'var(--bg-primary)',
                                                        border: '1px solid var(--border-subtle)',
                                                        borderRadius: '4px',
                                                        padding: '0.35rem 0.6rem',
                                                        cursor: 'pointer',
                                                        color: 'var(--text-main)',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onRequestToggleStatus(op)}
                                                    title={op.status === 'inactivo' ? 'Habilitar operador' : 'Suspender/Inactivar operador'}
                                                    style={{
                                                        background: 'var(--bg-primary)',
                                                        border: '1px solid var(--border-subtle)',
                                                        borderRadius: '4px',
                                                        padding: '0.35rem 0.6rem',
                                                        cursor: 'pointer',
                                                        color: op.status === 'inactivo' ? '#22C55E' : '#F59E0B',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    <i className={op.status === 'inactivo' ? 'fa-solid fa-user-check' : 'fa-solid fa-user-slash'}></i>
                                                </button>

                                                {onDeleteOperator && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteOperator(op)}
                                                        title="Eliminar operador del parqueo"
                                                        style={{
                                                            background: 'rgba(239, 68, 68, 0.12)',
                                                            border: '1px solid rgba(239, 68, 68, 0.25)',
                                                            borderRadius: '4px',
                                                            padding: '0.35rem 0.6rem',
                                                            cursor: 'pointer',
                                                            color: '#EF4444',
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Vista de Tarjetas para Pantallas Móviles (<= 768px) */}
            <div className="operator-cards-mobile">
                {loading ? (
                    <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}></i>
                        Cargando personal registrado...
                    </div>
                ) : paginatedOperators.length === 0 ? (
                    <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                        <i className="fa-solid fa-users-slash" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                        No se encontraron operadores registrados con los filtros aplicados.
                    </div>
                ) : (
                    paginatedOperators.map((op) => {
                        const isEnTurno = op.status === 'en-sitio';
                        const isActivo = op.status === 'activo';

                        return (
                            <div
                                key={op.id}
                                style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '10px',
                                    padding: '1rem',
                                    boxShadow: 'var(--card-shadow)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                }}
                            >
                                {/* Header de la Tarjeta */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                                        <div
                                            style={{
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '50%',
                                                background: 'var(--accent-emerald)',
                                                color: '#FFFFFF',
                                                fontWeight: 800,
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {op.avatarInitials}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem', wordBreak: 'break-word' }}>
                                                {op.fullName}
                                            </div>
                                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                                                {op.email}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estado */}
                                    <div style={{ flexShrink: 0 }}>
                                        {isEnTurno ? (
                                            <span
                                                style={{
                                                    background: 'rgba(34, 197, 94, 0.12)',
                                                    color: '#22C55E',
                                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                                    padding: '0.2rem 0.55rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem',
                                                }}
                                            >
                                                <span className="pulse-dot"></span> EN TURNO
                                            </span>
                                        ) : isActivo ? (
                                            <span
                                                style={{
                                                    background: 'rgba(59, 130, 246, 0.12)',
                                                    color: '#3B82F6',
                                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                                    padding: '0.2rem 0.55rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                }}
                                            >
                                                ACTIVO
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    background: 'rgba(148, 163, 184, 0.15)',
                                                    color: 'var(--text-muted)',
                                                    border: '1px solid var(--border-subtle)',
                                                    padding: '0.2rem 0.55rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                }}
                                            >
                                                INACTIVO
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Datos de Identificación y Teléfono */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.5rem',
                                        background: 'var(--bg-primary)',
                                        padding: '0.65rem 0.85rem',
                                        borderRadius: '6px',
                                        fontSize: '0.78rem',
                                    }}
                                >
                                    <div>
                                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 600 }}>IDENTIFICACIÓN</span>
                                        <strong style={{ color: 'var(--text-main)' }}>CI: {op.ci}</strong>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 600 }}>TELÉFONO</span>
                                        <a
                                            href={`tel:${op.phone}`}
                                            style={{ color: 'var(--border-highlight)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                                        >
                                            <i className="fa-solid fa-phone" style={{ fontSize: '0.7rem' }}></i>
                                            {op.phone}
                                        </a>
                                    </div>
                                </div>

                                {/* Barra de Acciones Táctiles */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: onDeleteOperator ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
                                        gap: '0.45rem',
                                        paddingTop: '0.4rem',
                                        borderTop: '1px solid var(--border-subtle)',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => onViewOperator(op)}
                                        title="Ver reporte y métricas de desempeño"
                                        style={{
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '6px',
                                            padding: '0.55rem',
                                            cursor: 'pointer',
                                            color: 'var(--text-main)',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <i className="fa-solid fa-chart-line"></i>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onEditOperator(op)}
                                        title="Editar datos del operador"
                                        style={{
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '6px',
                                            padding: '0.55rem',
                                            cursor: 'pointer',
                                            color: 'var(--text-main)',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onRequestToggleStatus(op)}
                                        title={op.status === 'inactivo' ? 'Habilitar operador' : 'Suspender/Inactivar operador'}
                                        style={{
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '6px',
                                            padding: '0.55rem',
                                            cursor: 'pointer',
                                            color: op.status === 'inactivo' ? '#22C55E' : '#F59E0B',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <i className={op.status === 'inactivo' ? 'fa-solid fa-user-check' : 'fa-solid fa-user-slash'}></i>
                                    </button>

                                    {onDeleteOperator && (
                                        <button
                                            type="button"
                                            onClick={() => onDeleteOperator(op)}
                                            title="Eliminar operador del parqueo"
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.12)',
                                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                                borderRadius: '6px',
                                                padding: '0.55rem',
                                                cursor: 'pointer',
                                                color: '#EF4444',
                                                fontSize: '0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Paginación Inferior */}
            <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', background: 'var(--bg-card)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Mostrando <strong style={{ color: 'var(--text-main)' }}>{startRecord}</strong> a <strong style={{ color: 'var(--text-main)' }}>{endRecord}</strong> de <strong style={{ color: 'var(--text-main)' }}>{totalItems}</strong> operadores
                </span>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                        type="button"
                        disabled={validCurrentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '0.3rem 0.65rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: validCurrentPage <= 1 ? 'var(--text-dim)' : 'var(--text-main)',
                            cursor: validCurrentPage <= 1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <i className="fa-solid fa-chevron-left" style={{ marginRight: '0.25rem' }}></i> Anterior
                    </button>

                    <button
                        type="button"
                        disabled={validCurrentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '0.3rem 0.65rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: validCurrentPage >= totalPages ? 'var(--text-dim)' : 'var(--text-main)',
                            cursor: validCurrentPage >= totalPages ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Siguiente <i className="fa-solid fa-chevron-right" style={{ marginLeft: '0.25rem' }}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
