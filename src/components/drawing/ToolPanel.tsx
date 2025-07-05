import React from 'react';
import { Button } from '../ui/Button';
import { useDrawingStore } from '../../store/useDrawingStore';
import { DEFAULT_COLORS, MIN_STROKE_WIDTH, MAX_STROKE_WIDTH } from '../../constants/Constants';
import { Brush, Eraser, Trash2, Undo, Redo } from 'lucide-react';

interface ToolPanelProps {
  onClearCanvas?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({
  onClearCanvas,
  onUndo,
  onRedo
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
    <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-2xl">
      {/* Herramientas */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          Herramientas
        </h3>
        <div className="flex gap-2">
          <Button
            variant={currentTool === 'brush' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCurrentTool('brush')}
            className="flex-1 shadow-md"
          >
            <Brush className="w-4 h-4 mr-1" />
            Pincel
          </Button>
          
          <Button
            variant={currentTool === 'eraser' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCurrentTool('eraser')}
            className="flex-1 shadow-md"
          >
            <Eraser className="w-4 h-4 mr-1" />
            Borrador
          </Button>
        </div>
      </div>

      {/* Colores */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          Colores
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`
                w-10 h-10 rounded-xl transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200
                ${currentColor === color
                  ? 'ring-4 ring-gray-800 scale-110 shadow-lg'
                  : 'ring-2 ring-gray-200 hover:ring-gray-300 shadow-md'
                }
              `}
              style={{ backgroundColor: color }}
              aria-label={`Seleccionar color ${color}`}
            />
          ))}
        </div>
        
        {/* Color personalizado */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">Color personalizado</label>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-full h-10 border-2 border-gray-200 rounded-xl cursor-pointer shadow-md hover:border-gray-300 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Grosor del trazo */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Grosor: {strokeWidth}px
        </h3>
        <div className="px-3 py-4 bg-gray-50 rounded-xl">
          <input
            type="range"
            min={MIN_STROKE_WIDTH}
            max={MAX_STROKE_WIDTH}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-300 rounded-lg cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{MIN_STROKE_WIDTH}px</span>
            <span>{MAX_STROKE_WIDTH}px</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          Acciones
        </h3>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onUndo}
          className="w-full shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <Undo className="w-4 h-4 mr-2" />
          Deshacer
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onRedo}
          className="w-full shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <Redo className="w-4 h-4 mr-2" />
          Rehacer
        </Button>
        
        <Button
          variant="danger"
          size="sm"
          onClick={onClearCanvas}
          className="w-full shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Limpiar todo
        </Button>
      </div>
    </div>
  );
};