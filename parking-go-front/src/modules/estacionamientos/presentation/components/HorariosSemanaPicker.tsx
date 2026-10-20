import React from 'react';
import type { DiaSemana, HorarioItemPayload } from '../../domain/Estacionamiento';

interface HorariosSemanaPickerProps {
  horarios: HorarioItemPayload[];
  onChange: (horarios: HorarioItemPayload[]) => void;
  disabled?: boolean;
}

const DIAS_SEMANA: { key: DiaSemana; label: string }[] = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
  { key: 'SABADO', label: 'Sábado' },
  { key: 'DOMINGO', label: 'Domingo' },
];

export const HorariosSemanaPicker: React.FC<HorariosSemanaPickerProps> = ({
  horarios,
  onChange,
  disabled = false,
}) => {
  const isDiaActivo = (dia: DiaSemana) => horarios.some((h) => h.dia === dia);

  const getHorarioDia = (dia: DiaSemana) => {
    return horarios.find((h) => h.dia === dia) || { dia, horaInicio: '08:00', horaCierre: '20:00' };
  };

  const toggleDia = (dia: DiaSemana) => {
    if (disabled) return;
    if (isDiaActivo(dia)) {
      onChange(horarios.filter((h) => h.dia !== dia));
    } else {
      onChange([...horarios, { dia, horaInicio: '08:00', horaCierre: '20:00' }]);
    }
  };

  const handleHoraChange = (
    dia: DiaSemana,
    field: 'horaInicio' | 'horaCierre',
    value: string,
  ) => {
    if (disabled) return;
    const exists = horarios.some((h) => h.dia === dia);
    if (!exists) {
      onChange([
        ...horarios,
        {
          dia,
          horaInicio: field === 'horaInicio' ? value : '08:00',
          horaCierre: field === 'horaCierre' ? value : '20:00',
        },
      ]);
    } else {
      onChange(
        horarios.map((h) => (h.dia === dia ? { ...h, [field]: value } : h)),
      );
    }
  };

  return (
    <div className="horarios-picker-container">
      <table className="horarios-picker-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>Activo</th>
            <th style={{ width: '120px' }}>Día</th>
            <th>Hora Apertura</th>
            <th>Hora Cierre</th>
          </tr>
        </thead>
        <tbody>
          {DIAS_SEMANA.map(({ key, label }) => {
            const activo = isDiaActivo(key);
            const horario = getHorarioDia(key);

            return (
              <tr key={key} style={{ opacity: activo ? 1 : 0.6 }}>
                <td>
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={() => toggleDia(key)}
                    disabled={disabled}
                    style={{ cursor: disabled ? 'not-allowed' : 'pointer', width: '18px', height: '18px' }}
                  />
                </td>
                <td style={{ fontWeight: 600 }}>{label}</td>
                <td>
                  <input
                    type="time"
                    className="form-input"
                    value={horario.horaInicio}
                    disabled={disabled || !activo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleHoraChange(key, 'horaInicio', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    className="form-input"
                    value={horario.horaCierre}
                    disabled={disabled || !activo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleHoraChange(key, 'horaCierre', e.target.value)
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
