import React from 'react';
import { Group, Rect, Text, Line } from 'react-konva';
import type Konva from 'konva';
import type { CroquisEspacioNode } from '../../../domain/Croquis';
import { pxToMeters, PIXELS_PER_METER } from '../../../domain/Croquis';
import { useCroquisEditorStore, type ModoCroquis } from '../../../application/useCroquisEditorStore';

interface CroquisBoxNodeProps {
  node: CroquisEspacioNode;
  isSelected: boolean;
  modo: ModoCroquis;
  snapToGrid: boolean;
  onSelect: (id: string) => void;
  onChange: (updated: CroquisEspacioNode) => void;
}

export const CroquisBoxNode: React.FC<CroquisBoxNodeProps> = ({
  node,
  isSelected,
  modo,
  snapToGrid,
  onSelect,
  onChange,
}) => {
  const { showDimensions } = useCroquisEditorStore();
  const isDraggable = modo === 'DISENIO';

  const getColors = () => {
    switch (node.estado) {
      case 'DISPONIBLE':
        return { fill: '#DCFCE7', stroke: '#166534', text: '#14532D' };
      case 'OCUPADO':
        return { fill: '#FEE2E2', stroke: '#991B1B', text: '#7F1D1D' };
      case 'RESERVADO':
        return { fill: '#DBEAFE', stroke: '#1E40AF', text: '#1E3A8A' };
      case 'MANTENIMIENTO':
        return { fill: '#FEF3C7', stroke: '#B45309', text: '#78350F' };
      default:
        return { fill: '#F1F5F9', stroke: '#64748B', text: '#334155' };
    }
  };

  const colors = getColors();

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    let newX = e.target.x();
    let newY = e.target.y();

    if (snapToGrid) {
      newX = Math.round(newX / PIXELS_PER_METER) * PIXELS_PER_METER;
      newY = Math.round(newY / PIXELS_PER_METER) * PIXELS_PER_METER;
      e.target.x(newX);
      e.target.y(newY);
    }

    onChange({
      ...node,
      x: newX,
      y: newY,
    });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const target = e.target;
    const scaleX = target.scaleX();
    const scaleY = target.scaleY();

    // Reset scale to avoid distortion, adjust width and height instead
    target.scaleX(1);
    target.scaleY(1);

    const newWidth = Math.max(30, Math.round(node.width * scaleX));
    const newHeight = Math.max(30, Math.round(node.height * scaleY));
    const newRotation = Math.round(target.rotation() % 360);

    onChange({
      ...node,
      x: target.x(),
      y: target.y(),
      width: newWidth,
      height: newHeight,
      rotation: newRotation,
    });
  };

  return (
    <Group
      id={node.id}
      x={node.x}
      y={node.y}
      rotation={node.rotation || 0}
      draggable={isDraggable}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(node.id);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect(node.id);
      }}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      {/* Rectángulo principal del box */}
      <Rect
        width={node.width}
        height={node.height}
        fill={colors.fill}
        stroke={isSelected ? '#006D36' : colors.stroke}
        strokeWidth={isSelected ? 3 : 1.5}
        cornerRadius={3}
        shadowColor="rgba(0, 0, 0, 0.08)"
        shadowBlur={isSelected ? 8 : 3}
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={0.4}
      />

      {/* Línea demarcatoria superior o tope vehicular */}
      <Rect
        x={3}
        y={3}
        width={node.width - 6}
        height={4}
        fill={colors.stroke}
        cornerRadius={2}
      />

      {/* Código del espacio en el centro */}
      <Text
        text={node.codigoEspacio}
        x={4}
        y={node.height / 2 - 12}
        width={node.width - 8}
        align="center"
        fontSize={Math.max(10, Math.min(14, node.width / 5))}
        fontStyle="bold"
        fill={colors.text}
        listening={false}
      />

      {/* Subtítulo con tipo de vehículo o estado */}
      <Text
        text={node.tipoVehiculo}
        x={4}
        y={node.height / 2 + 3}
        width={node.width - 8}
        align="center"
        fontSize={Math.max(8, Math.min(10, node.width / 7))}
        fill={colors.stroke}
        listening={false}
      />

      {/* Cotas arquitectónicas de ancho y largo del cajón */}
      {(showDimensions || isSelected) && (
        <Group listening={false}>
          {/* Cota horizontal (Ancho del cajón) */}
          <Line
            points={[0, -8, node.width, -8]}
            stroke={isSelected ? '#006D36' : colors.stroke}
            strokeWidth={1}
            dash={[2, 2]}
          />
          <Line
            points={[0, -12, 0, -4]}
            stroke={isSelected ? '#006D36' : colors.stroke}
            strokeWidth={1.2}
          />
          <Line
            points={[node.width, -12, node.width, -4]}
            stroke={isSelected ? '#006D36' : colors.stroke}
            strokeWidth={1.2}
          />
          <Rect
            x={Math.max(0, node.width / 2 - 24)}
            y={-18}
            width={48}
            height={13}
            fill={isSelected ? '#006D36' : colors.stroke}
            cornerRadius={2}
          />
          <Text
            x={Math.max(0, node.width / 2 - 24)}
            y={-16}
            width={48}
            text={`${pxToMeters(node.width).toFixed(1)}m`}
            align="center"
            fontSize={7.5}
            fontStyle="bold"
            fill="#FFFFFF"
          />

          {/* Cota vertical (Largo / Profundidad del cajón) */}
          <Line
            points={[-8, 0, -8, node.height]}
            stroke={isSelected ? '#006D36' : colors.stroke}
            strokeWidth={1}
            dash={[2, 2]}
          />
          <Line
            points={[-12, 0, -4, 0]}
            stroke={isSelected ? '#006D36' : colors.stroke}
            strokeWidth={1.2}
          />
          <Line
            points={[-12, node.height, -4, node.height]}
            stroke={isSelected ? '#006D36' : colors.stroke}
            strokeWidth={1.2}
          />
          <Rect
            x={-34}
            y={node.height / 2 - 6}
            width={26}
            height={12}
            fill={isSelected ? '#006D36' : colors.stroke}
            cornerRadius={2}
          />
          <Text
            x={-34}
            y={node.height / 2 - 5}
            width={26}
            text={`${pxToMeters(node.height).toFixed(1)}m`}
            align="center"
            fontSize={7}
            fontStyle="bold"
            fill="#FFFFFF"
          />
        </Group>
      )}
    </Group>
  );
};
