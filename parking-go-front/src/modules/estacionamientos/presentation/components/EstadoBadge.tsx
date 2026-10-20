import React from 'react';
import type { EstadoEstacionamiento } from '../../domain/Estacionamiento';

interface EstadoBadgeProps {
  estado: EstadoEstacionamiento;
}

export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
  const getLabelAndClass = () => {
    switch (estado) {
      case 'PENDIENTE':
        return { label: 'Pendiente de Aprobación', className: 'badge-estado pendiente' };
      case 'APROBADO':
        return { label: 'Aprobado / Activo', className: 'badge-estado aprobado' };
      case 'RECHAZADO':
        return { label: 'Rechazado', className: 'badge-estado rechazado' };
      case 'INHABILITADO':
        return { label: 'Inhabilitado', className: 'badge-estado inhabilitado' };
      default:
        return { label: estado, className: 'badge-estado' };
    }
  };

  const { label, className } = getLabelAndClass();

  return <span className={className}>{label}</span>;
};
