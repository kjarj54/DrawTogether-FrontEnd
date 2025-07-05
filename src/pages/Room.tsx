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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cargando sala...
          </h2>
          <p className="text-gray-600">Por favor espera</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLeaveRoom}
                className="mr-4 shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Salir
              </Button>
              
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentRoom.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentRoom.currentParticipantsCount} de {currentRoom.maxParticipants} participantes
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Estado de conexión */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/60 rounded-xl border border-white/30 shadow-sm">
                {connection.isConnected ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {connection.isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>

              {/* Usuario actual */}
              <div className="flex items-center px-3 py-2 bg-white/60 rounded-xl border border-white/30 shadow-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2 ring-2 ring-white shadow-sm"
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
          <div className="lg:col-span-1 space-y-6">
            <ToolPanel
              onClearCanvas={clearCanvas}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
            
            {/* Panel de participantes */}
            <ParticipantsPanel />
          </div>

          {/* Canvas de dibujo */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Lienzo Colaborativo
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>En tiempo real</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="p-4 bg-gray-50 rounded-xl shadow-inner">
                  <DrawingCanvas
                    width={800}
                    height={600}
                    className="rounded-lg shadow-lg bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Errores de conexión */}
      {connection.error && (
        <div className="fixed bottom-4 right-4 bg-red-50/90 backdrop-blur-lg border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-xl">
          <div className="flex items-center">
            <WifiOff className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{connection.error}</span>
          </div>
        </div>
      )}
    </div>
  );
};