import React, { useState } from 'react';
import type { EspacioModel } from '../../../domain/Espacio';

interface CroquisSidebarEspaciosProps {
  espacios: EspacioModel[];
  espacioIdsEnLienzo: Set<string>;
  selectedNodeId: string | null;
  onColocarEspacio: (espacio: EspacioModel) => void;
  onSeleccionarEspacioEnLienzo: (espacioId: string) => void;
}

export const CroquisSidebarEspacios: React.FC<CroquisSidebarEspaciosProps> = ({
  espacios,
  espacioIdsEnLienzo,
  selectedNodeId,
  onColocarEspacio,
  onSeleccionarEspacioEnLienzo,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterPendientes, setFilterPendientes] = useState(false);

  const total = espacios.length;
  const ubicados = espacios.filter((e) => espacioIdsEnLienzo.has(e.id)).length;
  const pendientes = total - ubicados;

  const displayList = filterPendientes
    ? espacios.filter((e) => !espacioIdsEnLienzo.has(e.id))
    : espacios;

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => setIsCollapsed(false)}
        title="Mostrar panel de espacios del nivel"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 10,
          background: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '4px',
          padding: '0.45rem 0.65rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.74rem',
          fontWeight: 700,
          color: '#0F172A',
        }}
      >
        <i className="fa-solid fa-list-check" style={{ color: '#006D36' }}></i>
        <span>Espacios ({pendientes} pendientes)</span>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.65rem' }}></i>
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 10,
        width: '260px',
        maxHeight: 'calc(100% - 20px)',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Cabecera del Sidebar */}
      <div
        style={{
          padding: '0.6rem 0.8rem',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <i className="fa-solid fa-square-parking" style={{ color: '#006D36' }}></i>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
            Espacios del Nivel
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          title="Minimizar panel"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '0.15rem',
            fontSize: '0.75rem',
          }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      </div>

      {/* Métricas y Filtro */}
      <div
        style={{
          padding: '0.45rem 0.8rem',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          background: '#FAFAFA',
        }}
      >
        <span style={{ color: '#64748B' }}>
          Ubicados: <strong style={{ color: '#166534' }}>{ubicados}</strong> / {total}
        </span>

        <button
          type="button"
          onClick={() => setFilterPendientes(!filterPendientes)}
          style={{
            background: filterPendientes ? '#DCFCE7' : 'transparent',
            color: filterPendientes ? '#166534' : '#475569',
            border: 'none',
            borderRadius: '3px',
            padding: '0.15rem 0.4rem',
            fontSize: '0.68rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {filterPendientes ? 'Ver todos' : `Solo pendientes (${pendientes})`}
        </button>
      </div>

      {/* Lista de Espacios con Scroll */}
      <div
        style={{
          padding: '0.45rem 0.6rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        {displayList.length === 0 ? (
          <div
            style={{
              padding: '1.5rem 0.5rem',
              textAlign: 'center',
              color: '#94A3B8',
              fontSize: '0.72rem',
            }}
          >
            {filterPendientes
              ? '¡Todos los espacios de este nivel ya están colocados en el croquis!'
              : 'No hay espacios registrados en este nivel.'}
          </div>
        ) : (
          displayList.map((espacio) => {
            const yaEnLienzo = espacioIdsEnLienzo.has(espacio.id);
            const isSelected = selectedNodeId === espacio.id;

            return (
              <div
                key={espacio.id}
                style={{
                  padding: '0.35rem 0.55rem',
                  borderRadius: '3px',
                  background: isSelected ? '#F0FDF4' : '#FFFFFF',
                  border: isSelected ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#0F172A' }}>
                    {espacio.codigoEspacio}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748B' }}>
                    {espacio.tipo} • {espacio.modalidad}
                  </div>
                </div>

                <div>
                  {yaEnLienzo ? (
                    <button
                      type="button"
                      onClick={() => onSeleccionarEspacioEnLienzo(espacio.id)}
                      title="Seleccionar y enfocar en el plano"
                      style={{
                        background: '#DCFCE7',
                        border: '1px solid #BBF7D0',
                        color: '#166534',
                        borderRadius: '3px',
                        padding: '0.15rem 0.45rem',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Ubicado
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onColocarEspacio(espacio)}
                      title="Colocar este espacio en el croquis"
                      style={{
                        background: '#006D36',
                        border: 'none',
                        color: '#FFFFFF',
                        borderRadius: '3px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Colocar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
