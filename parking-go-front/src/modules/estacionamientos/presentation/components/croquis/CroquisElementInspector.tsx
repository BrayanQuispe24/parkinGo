import React from 'react';
import type {
  CroquisNode,
  CroquisMuroNode,
  CroquisEntradaNode,
  CroquisFlechaNode,
  CroquisPuertaNode,
  CroquisEspacioNode,
  SubtipoEntrada,
  SubtipoPuerta,
} from '../../../domain/Croquis';
import { pxToMeters, metersToPx } from '../../../domain/Croquis';

interface CroquisElementInspectorProps {
  node: CroquisNode | null;
  onChange: (updated: CroquisNode) => void;
  onDelete: () => void;
  onDeselect: () => void;
  onNudge?: (dx: number, dy: number) => void;
}

export const CroquisElementInspector: React.FC<CroquisElementInspectorProps> = ({
  node,
  onChange,
  onDelete,
  onDeselect,
  onNudge,
}) => {
  const [nudgeStep, setNudgeStep] = React.useState<1 | 5 | 25>(5);

  if (!node) return null;

  // Rotar +90 grados rápido
  const handleRotate90 = () => {
    const currentRot = node.rotation || 0;
    const newRot = (Math.round(currentRot / 90) * 90 + 90) % 360;
    onChange({ ...node, rotation: newRot });
  };

  // Manejador de rotación manual
  const handleRotationChange = (val: number) => {
    const safeRot = Math.round(((val % 360) + 360) % 360);
    onChange({ ...node, rotation: safeRot });
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderLeft: '4px solid #006D36',
        borderRadius: '4px',
        padding: '0.45rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.04)',
        animation: 'fadeIn 0.15s ease-in-out',
      }}
    >
      {/* 1. Identificador del elemento seleccionado */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            background: '#F1F5F9',
            color: '#0F172A',
            padding: '0.2rem 0.45rem',
            borderRadius: '3px',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          {node.tipo === 'MURO' && <i className="fa-solid fa-square" style={{ color: '#475569' }}></i>}
          {node.tipo === 'ENTRADA' && <i className="fa-solid fa-right-to-bracket" style={{ color: '#10B981' }}></i>}
          {node.tipo === 'FLECHA' && <i className="fa-solid fa-arrow-right" style={{ color: '#2563EB' }}></i>}
          {node.tipo === 'PUERTA' && <i className="fa-solid fa-door-open" style={{ color: '#D97706' }}></i>}
          {node.tipo === 'ESPACIO' && <i className="fa-solid fa-car" style={{ color: '#006D36' }}></i>}
          <span>
            {node.tipo === 'ESPACIO'
              ? `ESPACIO ${(node as CroquisEspacioNode).codigoEspacio}`
              : node.tipo}
          </span>
        </span>
        {node.tipo === 'ESPACIO' && (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.15rem 0.35rem',
              borderRadius: '2px',
              background: '#ECFDF5',
              color: '#065F46',
            }}
          >
            {(node as CroquisEspacioNode).tipoVehiculo}
          </span>
        )}
        <span style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'monospace' }}>
          {node.id.length > 18 ? node.id.slice(0, 18) + '...' : node.id}
        </span>
      </div>

      {/* 2. Controles de dimensiones según el tipo de elemento */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        {/* Caso A: MURO */}
        {node.tipo === 'MURO' && (
          <>
            {/* Largo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Largo:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
                <input
                  type="number"
                  min={0.4}
                  max={50}
                  step={0.1}
                  value={pxToMeters((node as CroquisMuroNode).width)}
                  onChange={(e) => {
                    const m = Math.max(0.4, Number(e.target.value));
                    onChange({ ...(node as CroquisMuroNode), width: metersToPx(m) });
                  }}
                  style={{
                    width: '52px',
                    padding: '0.2rem 0.35rem',
                    fontSize: '0.74rem',
                    border: 'none',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: '0.68rem', padding: '0 0.3rem', background: '#F1F5F9', color: '#64748B' }}>
                  m
                </span>
              </div>
            </div>

            {/* Espesor / Grosor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Espesor:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
                <input
                  type="number"
                  min={0.2}
                  max={5}
                  step={0.05}
                  value={pxToMeters((node as CroquisMuroNode).height)}
                  onChange={(e) => {
                    const m = Math.max(0.2, Number(e.target.value));
                    onChange({ ...(node as CroquisMuroNode), height: metersToPx(m) });
                  }}
                  style={{
                    width: '48px',
                    padding: '0.2rem 0.35rem',
                    fontSize: '0.74rem',
                    border: 'none',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: '0.68rem', padding: '0 0.3rem', background: '#F1F5F9', color: '#64748B' }}>
                  m
                </span>
              </div>
            </div>
          </>
        )}

        {/* Caso B: ENTRADA */}
        {node.tipo === 'ENTRADA' && (
          <>
            {/* Ancho de paso / carril */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Ancho Carril:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
                <input
                  type="number"
                  min={1.5}
                  max={15}
                  step={0.1}
                  value={pxToMeters((node as CroquisEntradaNode).width)}
                  onChange={(e) => {
                    const m = Math.max(1.5, Number(e.target.value));
                    onChange({ ...(node as CroquisEntradaNode), width: metersToPx(m) });
                  }}
                  style={{
                    width: '52px',
                    padding: '0.2rem 0.35rem',
                    fontSize: '0.74rem',
                    border: 'none',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: '0.68rem', padding: '0 0.3rem', background: '#F1F5F9', color: '#64748B' }}>
                  m
                </span>
              </div>
            </div>

            {/* Profundidad del carril */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Profundidad:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
                <input
                  type="number"
                  min={1.0}
                  max={10}
                  step={0.1}
                  value={pxToMeters((node as CroquisEntradaNode).height)}
                  onChange={(e) => {
                    const m = Math.max(1.0, Number(e.target.value));
                    onChange({ ...(node as CroquisEntradaNode), height: metersToPx(m) });
                  }}
                  style={{
                    width: '48px',
                    padding: '0.2rem 0.35rem',
                    fontSize: '0.74rem',
                    border: 'none',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: '0.68rem', padding: '0 0.3rem', background: '#F1F5F9', color: '#64748B' }}>
                  m
                </span>
              </div>
            </div>

            {/* Subtipo de entrada */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Tipo:</label>
              <select
                value={(node as CroquisEntradaNode).subtipoEntrada}
                onChange={(e) =>
                  onChange({
                    ...(node as CroquisEntradaNode),
                    subtipoEntrada: e.target.value as SubtipoEntrada,
                  })
                }
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.35rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '3px',
                  background: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                <option value="VEHICULAR">Vehicular</option>
                <option value="PEATONAL">Peatonal</option>
                <option value="MIXTA">Mixta</option>
              </select>
            </div>

            {/* Toggle Talanquera / Barrera */}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...(node as CroquisEntradaNode),
                  conBarrera: !(node as CroquisEntradaNode).conBarrera,
                })
              }
              title="Activar/Desactivar pluma de acceso"
              style={{
                background: (node as CroquisEntradaNode).conBarrera ? '#FEF2F2' : '#F1F5F9',
                color: (node as CroquisEntradaNode).conBarrera ? '#DC2626' : '#64748B',
                border: '1px solid ' + ((node as CroquisEntradaNode).conBarrera ? '#FECACA' : '#CBD5E1'),
                borderRadius: '3px',
                padding: '0.2rem 0.45rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <i className="fa-solid fa-road-barrier"></i>
              <span>Barrera {(node as CroquisEntradaNode).conBarrera ? 'SÍ' : 'NO'}</span>
            </button>
          </>
        )}

        {/* Caso C: FLECHA */}
        {node.tipo === 'FLECHA' && (
          <>
            {/* Longitud de flecha */}
            {(() => {
              const flechaNode = node as CroquisFlechaNode;
              const currentPts = flechaNode.points || [0, 0, 80, 0];
              const currentLen = Math.abs(currentPts[2] - currentPts[0]) || 80;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Longitud:</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
                    <input
                      type="number"
                      min={0.8}
                      max={25}
                      step={0.1}
                      value={pxToMeters(currentLen)}
                      onChange={(e) => {
                        const m = Math.max(0.8, Number(e.target.value));
                        const px = metersToPx(m);
                        onChange({
                          ...flechaNode,
                          points: [0, 0, px, 0],
                        });
                      }}
                      style={{
                        width: '52px',
                        padding: '0.2rem 0.35rem',
                        fontSize: '0.74rem',
                        border: 'none',
                        outline: 'none',
                        fontWeight: 600,
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', padding: '0 0.3rem', background: '#F1F5F9', color: '#64748B' }}>
                      m
                    </span>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {/* Caso D: PUERTA / PORTÓN */}
        {node.tipo === 'PUERTA' && (
          <>
            {/* Ancho de apertura */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Ancho:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
                <input
                  type="number"
                  min={1.0}
                  max={20}
                  step={0.1}
                  value={pxToMeters((node as CroquisPuertaNode).width)}
                  onChange={(e) => {
                    const m = Math.max(1.0, Number(e.target.value));
                    onChange({ ...(node as CroquisPuertaNode), width: metersToPx(m) });
                  }}
                  style={{
                    width: '52px',
                    padding: '0.2rem 0.35rem',
                    fontSize: '0.74rem',
                    border: 'none',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: '0.68rem', padding: '0 0.3rem', background: '#F1F5F9', color: '#64748B' }}>
                  m
                </span>
              </div>
            </div>

            {/* Espesor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Alto:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
                <input
                  type="number"
                  min={0.4}
                  max={5}
                  step={0.05}
                  value={pxToMeters((node as CroquisPuertaNode).height)}
                  onChange={(e) => {
                    const m = Math.max(0.4, Number(e.target.value));
                    onChange({ ...(node as CroquisPuertaNode), height: metersToPx(m) });
                  }}
                  style={{
                    width: '48px',
                    padding: '0.2rem 0.35rem',
                    fontSize: '0.74rem',
                    border: 'none',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: '0.68rem', padding: '0 0.3rem', background: '#F1F5F9', color: '#64748B' }}>
                  m
                </span>
              </div>
            </div>

            {/* Subtipo de puerta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Sentido:</label>
              <select
                value={(node as CroquisPuertaNode).subtipo}
                onChange={(e) =>
                  onChange({
                    ...(node as CroquisPuertaNode),
                    subtipo: e.target.value as SubtipoPuerta,
                  })
                }
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.35rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '3px',
                  background: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                <option value="MIXTO">Portón ⇄</option>
                <option value="ENTRADA">Entrada ➜</option>
                <option value="SALIDA">Salida ➜</option>
              </select>
            </div>
          </>
        )}

        {/* Caso E: ESPACIO DE ESTACIONAMIENTO */}
        {node.tipo === 'ESPACIO' && (
          <>
            {/* Ancho del cajón */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Ancho:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
                <input
                  type="number"
                  min={1.0}
                  max={12}
                  step={0.1}
                  value={pxToMeters((node as CroquisEspacioNode).width)}
                  onChange={(e) => {
                    const m = Math.max(1.0, Number(e.target.value));
                    onChange({ ...(node as CroquisEspacioNode), width: metersToPx(m) });
                  }}
                  style={{
                    width: '50px',
                    padding: '0.2rem 0.35rem',
                    fontSize: '0.74rem',
                    border: 'none',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: '0.68rem', padding: '0 0.3rem', background: '#F1F5F9', color: '#64748B' }}>
                  m
                </span>
              </div>
            </div>

            {/* Largo / Profundidad del cajón */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Largo:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
                <input
                  type="number"
                  min={1.5}
                  max={20}
                  step={0.1}
                  value={pxToMeters((node as CroquisEspacioNode).height)}
                  onChange={(e) => {
                    const m = Math.max(1.5, Number(e.target.value));
                    onChange({ ...(node as CroquisEspacioNode), height: metersToPx(m) });
                  }}
                  style={{
                    width: '50px',
                    padding: '0.2rem 0.35rem',
                    fontSize: '0.74rem',
                    border: 'none',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: '0.68rem', padding: '0 0.3rem', background: '#F1F5F9', color: '#64748B' }}>
                  m
                </span>
              </div>
            </div>

            {/* Presets rápidos de cajón vehicular */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...(node as CroquisEspacioNode),
                    width: metersToPx(2.8),
                    height: metersToPx(4.8),
                  })
                }
                title="Cajón Auto estándar: 2.8m × 4.8m"
                style={{
                  background: '#F8FAFC',
                  color: '#1E293B',
                  border: '1px solid #CBD5E1',
                  borderRadius: '3px',
                  padding: '0.2rem 0.4rem',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Auto (2.8×4.8)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...(node as CroquisEspacioNode),
                    width: metersToPx(1.4),
                    height: metersToPx(2.4),
                  })
                }
                title="Cajón Moto: 1.4m × 2.4m"
                style={{
                  background: '#F8FAFC',
                  color: '#1E293B',
                  border: '1px solid #CBD5E1',
                  borderRadius: '3px',
                  padding: '0.2rem 0.4rem',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Moto (1.4×2.4)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...(node as CroquisEspacioNode),
                    width: metersToPx(3.2),
                    height: metersToPx(5.6),
                  })
                }
                title="Cajón SUV / Camioneta: 3.2m × 5.6m"
                style={{
                  background: '#F8FAFC',
                  color: '#1E293B',
                  border: '1px solid #CBD5E1',
                  borderRadius: '3px',
                  padding: '0.2rem 0.4rem',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                SUV (3.2×5.6)
              </button>
            </div>
          </>
        )}

        {/* Control común: Rotación en Grados */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>Giro:</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
            <input
              type="number"
              min={0}
              max={360}
              step={15}
              value={Math.round(node.rotation || 0)}
              onChange={(e) => handleRotationChange(Number(e.target.value))}
              style={{
                width: '45px',
                padding: '0.2rem 0.3rem',
                fontSize: '0.74rem',
                border: 'none',
                outline: 'none',
                fontWeight: 600,
              }}
            />
            <span style={{ fontSize: '0.68rem', padding: '0 0.25rem', background: '#F1F5F9', color: '#64748B' }}>
              °
            </span>
          </div>
        </div>

        {/* Botón Girar +90° */}
        <button
          type="button"
          onClick={handleRotate90}
          title="Girar 90° en sentido horario"
          style={{
            background: '#F8FAFC',
            color: '#334155',
            border: '1px solid #CBD5E1',
            borderRadius: '3px',
            padding: '0.2rem 0.45rem',
            fontSize: '0.7rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <i className="fa-solid fa-rotate-right"></i>
          <span>+90°</span>
        </button>

        {/* 2.5 Controles Visibles de Posición y Movimiento */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '4px',
            padding: '0.2rem 0.5rem',
          }}
        >
          {/* Inputs editables de X e Y */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>X:</span>
            <input
              type="number"
              step={1}
              value={Math.round(node.x)}
              onChange={(e) => {
                const val = Math.max(0, Math.round(Number(e.target.value)));
                onChange({ ...node, x: val });
              }}
              style={{
                width: '42px',
                padding: '0.15rem 0.25rem',
                fontSize: '0.72rem',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>Y:</span>
            <input
              type="number"
              step={1}
              value={Math.round(node.y)}
              onChange={(e) => {
                const val = Math.max(0, Math.round(Number(e.target.value)));
                onChange({ ...node, y: val });
              }}
              style={{
                width: '42px',
                padding: '0.15rem 0.25rem',
                fontSize: '0.72rem',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            />
          </div>

          {/* Selector de Paso (1px | 5px | 1m) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.15rem',
              background: '#FFFFFF',
              padding: '0.1rem',
              borderRadius: '3px',
              border: '1px solid #CBD5E1',
            }}
          >
            {([1, 5, 25] as const).map((stepVal) => (
              <button
                key={stepVal}
                type="button"
                onClick={() => setNudgeStep(stepVal)}
                title={`Paso de movimiento: ${stepVal === 25 ? '25px (1 metro)' : `${stepVal}px`}`}
                style={{
                  background: nudgeStep === stepVal ? '#006D36' : 'transparent',
                  color: nudgeStep === stepVal ? '#FFFFFF' : '#475569',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '0.1rem 0.3rem',
                  fontSize: '0.62rem',
                  fontWeight: nudgeStep === stepVal ? 800 : 600,
                  cursor: 'pointer',
                }}
              >
                {stepVal === 25 ? '1m' : `${stepVal}px`}
              </button>
            ))}
          </div>

          {/* Botonera Direccional D-Pad */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
            <button
              type="button"
              onClick={() => (onNudge ? onNudge(-nudgeStep, 0) : onChange({ ...node, x: Math.max(0, node.x - nudgeStep) }))}
              title={`Mover Izquierda ${nudgeStep}px (◄)`}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                width: '20px',
                height: '20px',
                padding: 0,
                fontSize: '0.62rem',
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button
              type="button"
              onClick={() => (onNudge ? onNudge(0, -nudgeStep) : onChange({ ...node, y: Math.max(0, node.y - nudgeStep) }))}
              title={`Mover Arriba ${nudgeStep}px (▲)`}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                width: '20px',
                height: '20px',
                padding: 0,
                fontSize: '0.62rem',
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
            <button
              type="button"
              onClick={() => (onNudge ? onNudge(0, nudgeStep) : onChange({ ...node, y: node.y + nudgeStep }))}
              title={`Mover Abajo ${nudgeStep}px (▼)`}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                width: '20px',
                height: '20px',
                padding: 0,
                fontSize: '0.62rem',
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fa-solid fa-arrow-down"></i>
            </button>
            <button
              type="button"
              onClick={() => (onNudge ? onNudge(nudgeStep, 0) : onChange({ ...node, x: node.x + nudgeStep }))}
              title={`Mover Derecha ${nudgeStep}px (►)`}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                width: '20px',
                height: '20px',
                padding: 0,
                fontSize: '0.62rem',
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Acciones de elemento: Eliminar y Deseleccionar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          type="button"
          onClick={onDelete}
          title="Eliminar este elemento del croquis"
          style={{
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
            borderRadius: '3px',
            padding: '0.22rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <i className="fa-solid fa-trash-can"></i>
          <span>Quitar</span>
        </button>

        <button
          type="button"
          onClick={onDeselect}
          title="Cerrar inspector y deseleccionar"
          style={{
            background: '#F1F5F9',
            color: '#64748B',
            border: 'none',
            borderRadius: '3px',
            padding: '0.22rem 0.45rem',
            fontSize: '0.74rem',
            cursor: 'pointer',
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};
