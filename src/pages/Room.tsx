import React, { useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { DrawingCanvas } from '../components/drawing/DrawingCanvas';
import { ToolPanel } from '../components/drawing/ToolPanel';
import { ParticipantsPanel } from '../components/room/ParticipantsPanel';
import { useAppStore } from '../store/useAppStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { useCanvas } from '../hooks/useCanvas';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';

interface RoomProps {
  onLeaveRoom: () => void;
}

export const Room: React.FC<RoomProps> = ({ onLeaveRoom }) => {
  const { currentRoom, currentUser, connection } = useAppStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { leaveRoom, disconnect } = useWebSocket();
  const { clearCanvas } = useCanvas();

  // Redireccionar si no hay sala
  useEffect(() => {
    if (!currentRoom || !currentUser) {
      onLeaveRoom();
    }
  }, [currentRoom, currentUser, onLeaveRoom]);

  const handleLeaveRoom = () => {
    leaveRoom();
    onLeaveRoom();
  };

  const handleUndo = () => {
    // TODO: Implementar undo/redo
    console.log('Undo functionality');
  };

  const handleRedo = () => {
    // TODO: Implementar undo/redo
    console.log('Redo functionality');
  };

  if (!currentRoom || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cargando sala...
          </h2>
          <p className="text-gray-600">Por favor espera</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLeaveRoom}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Salir
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentRoom.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentRoom.currentParticipantsCount} de {currentRoom.maxParticipants} participantes
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Estado de conexión */}
              <div className="flex items-center space-x-2">
                {connection.isConnected ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-600">
                  {connection.isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>

              {/* Usuario actual */}
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: currentUser.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {currentUser.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de herramientas */}
          <div className="lg:col-span-1">
            <ToolPanel
              onClearCanvas={clearCanvas}
              onUndo={handleUndo}
              onRedo={handleRedo}
              className="mb-6"
            />
            
            {/* Panel de participantes */}
            <ParticipantsPanel />
          </div>

          {/* Canvas de dibujo */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Lienzo Colaborativo
              </h2>
              
              <div className="flex justify-center">
                <DrawingCanvas
                  width={800}
                  height={600}
                  className="shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Errores de conexión */}
      {connection.error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          <div className="flex items-center">
            <WifiOff className="w-4 h-4 mr-2" />
            <span className="text-sm">{connection.error}</span>
          </div>
        </div>
      )}
    </div>
  );
};