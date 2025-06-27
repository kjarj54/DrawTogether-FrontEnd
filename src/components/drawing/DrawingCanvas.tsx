import React from 'react';
import { useCanvas } from '../../hooks/useCanvas';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  width = 800, 
  height = 600, 
  className = '' 
}) => {
  const { canvasRef, isDrawing } = useCanvas();

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`border border-gray-300 rounded-lg cursor-crosshair ${
          isDrawing ? 'cursor-none' : ''
        }`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          touchAction: 'none' // Prevenir scroll en móviles
        }}
      />
      
      {/* Indicador de dibujo */}
      {isDrawing && (
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
          Dibujando...
        </div>
      )}
    </div>
  );
};