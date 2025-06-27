import React from 'react';
import { Button } from '../ui/Button';
import { useDrawingStore } from '../../store/useDrawingStore';
import { DEFAULT_COLORS, MIN_STROKE_WIDTH, MAX_STROKE_WIDTH } from '../../constants/Constants';
import { Brush, Eraser, Trash2, Undo, Redo } from 'lucide-react';

interface ToolPanelProps {
  onClearCanvas?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  className?: string;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({
  onClearCanvas,
  onUndo,
  onRedo,
  className = ''
}) => {
  const {
    currentTool,
    currentColor,
    strokeWidth,
    setCurrentTool,
    setCurrentColor,
    setStrokeWidth
  } = useDrawingStore();

  return (
    <div className={`bg-white border rounded p-4 ${className}`}>
      {/* Herramientas */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-dark mb-3">Herramientas</h3>
        <div className="flex gap-2">
          <Button
            variant={currentTool === 'brush' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCurrentTool('brush')}
            className="flex items-center"
          >
            <Brush className="w-4 h-4 mr-1" />
            Pincel
          </Button>
          
          <Button
            variant={currentTool === 'eraser' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCurrentTool('eraser')}
            className="flex items-center"
          >
            <Eraser className="w-4 h-4 mr-1" />
            Borrador
          </Button>
        </div>
      </div>

      {/* Colores */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-dark mb-3">Colores</h3>
        <div className="grid grid-cols-4 gap-2">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-8 h-8 rounded border-2 transition-all hover-scale ${
                currentColor === color
                  ? 'border-dark shadow-md'
                  : 'border-light'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Seleccionar color ${color}`}
            />
          ))}
        </div>
        
        {/* Color personalizado */}
        <div className="mt-3">
          <label className="block text-xs text-secondary mb-1">Color personalizado</label>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-full h-8 border rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Grosor del trazo */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-dark mb-3">
          Grosor: {strokeWidth}px
        </h3>
        <input
          type="range"
          min={MIN_STROKE_WIDTH}
          max={MAX_STROKE_WIDTH}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-full h-2 bg-light rounded cursor-pointer"
        />
        <div className="flex justify-between text-xs text-secondary mt-1">
          <span>{MIN_STROKE_WIDTH}px</span>
          <span>{MAX_STROKE_WIDTH}px</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-dark">Acciones</h3>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onUndo}
          className="w-full flex items-center justify-center"
        >
          <Undo className="w-4 h-4 mr-2" />
          Deshacer
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onRedo}
          className="w-full flex items-center justify-center"
        >
          <Redo className="w-4 h-4 mr-2" />
          Rehacer
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onClearCanvas}
          className="w-full flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Limpiar todo
        </Button>
      </div>
    </div>
  );
};