import React from 'react';
import { Group, Rect, Text, Line } from 'react-konva';
import type Konva from 'konva';
import type { CroquisMuroNode as CroquisMuroNodeType } from '../../../domain/Croquis';
import { pxToMeters, PIXELS_PER_METER } from '../../../domain/Croquis';
import { useCroquisEditorStore, type ModoCroquis } from '../../../application/useCroquisEditorStore';

interface CroquisMuroNodeProps {
  node: CroquisMuroNodeType;
  isSelected: boolean;
  modo: ModoCroquis;
  snapToGrid: boolean;
  onSelect: (id: string) => void;
  onChange: (updated: CroquisMuroNodeType) => void;
}

export const CroquisMuroNode: React.FC<CroquisMuroNodeProps> = ({
  node,
  isSelected,
  modo,
  snapToGrid,
  onSelect,
  onChange,
}) => {
  const { showDimensions } = useCroquisEditorStore();
  const isDraggable = modo === 'DISENIO';

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

    target.scaleX(1);
    target.scaleY(1);

    const newWidth = Math.max(15, Math.round(node.width * scaleX));
    const newHeight = Math.max(15, Math.round(node.height * scaleY));
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

  const lengthMeters = pxToMeters(node.width);
  const thicknessMeters = pxToMeters(node.height);
  const shouldShowDimensions = showDimensions || isSelected;

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
      {/* Cuerpo principal del muro */}
      <Rect
        width={node.width}
        height={node.height}
        fill="#334155"
        stroke={isSelected ? '#006D36' : '#1E293B'}
        strokeWidth={isSelected ? 3 : 1}
        cornerRadius={2}
        shadowColor={isSelected ? 'rgba(0, 109, 54, 0.3)' : undefined}
        shadowBlur={isSelected ? 8 : 0}
      />

      {/* Texto interno 'MURO' si las dimensiones lo permiten */}
      {node.width >= 50 && node.height >= 18 && (
        <Text
          text={`MURO • ${lengthMeters.toFixed(1)}m`}
          width={node.width}
          y={node.height / 2 - 5}
          align="center"
          fontSize={8}
          fontStyle="bold"
          fill="#E2E8F0"
          listening={false}
        />
      )}

      {/* Cotas arquitectónicas exteriores */}
      {shouldShowDimensions && (
        <Group listening={false}>
          {/* Cota de longitud (eje horizontal superior) */}
          <Line
            points={[0, -8, node.width, -8]}
            stroke={isSelected ? '#006D36' : '#64748B'}
            strokeWidth={1}
            dash={[2, 2]}
          />
          {/* Ticks laterales de acotación */}
          <Line
            points={[0, -12, 0, -4]}
            stroke={isSelected ? '#006D36' : '#64748B'}
            strokeWidth={1.2}
          />
          <Line
            points={[node.width, -12, node.width, -4]}
            stroke={isSelected ? '#006D36' : '#64748B'}
            strokeWidth={1.2}
          />

          {/* Badge con la medida exacta de longitud */}
          <Rect
            x={Math.max(0, node.width / 2 - 24)}
            y={-18}
            width={48}
            height={13}
            fill={isSelected ? '#006D36' : '#1E293B'}
            cornerRadius={2}
          />
          <Text
            x={Math.max(0, node.width / 2 - 24)}
            y={-16}
            width={48}
            text={`${lengthMeters.toFixed(2)}m`}
            align="center"
            fontSize={8}
            fontStyle="bold"
            fill="#FFFFFF"
          />

          {/* Cota de espesor (si el muro tiene altura considerable) */}
          {node.height >= 25 && (
            <>
              <Line
                points={[-8, 0, -8, node.height]}
                stroke={isSelected ? '#006D36' : '#64748B'}
                strokeWidth={1}
                dash={[2, 2]}
              />
              <Line
                points={[-12, 0, -4, 0]}
                stroke={isSelected ? '#006D36' : '#64748B'}
                strokeWidth={1.2}
              />
              <Line
                points={[-12, node.height, -4, node.height]}
                stroke={isSelected ? '#006D36' : '#64748B'}
                strokeWidth={1.2}
              />
              <Rect
                x={-34}
                y={node.height / 2 - 6}
                width={26}
                height={12}
                fill={isSelected ? '#006D36' : '#475569'}
                cornerRadius={2}
              />
              <Text
                x={-34}
                y={node.height / 2 - 5}
                width={26}
                text={`${thicknessMeters.toFixed(1)}m`}
                align="center"
                fontSize={7}
                fontStyle="bold"
                fill="#FFFFFF"
              />
            </>
          )}
        </Group>
      )}
    </Group>
  );
};
