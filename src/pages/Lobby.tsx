import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAppStore } from '../store/useAppStore';
import { useUser } from '../hooks/useUser';
import { useToast } from '../hooks/useToast';
import { ROOM_LIMITS } from '../constants/Constants';
import { Users, Plus, LogOut } from 'lucide-react';
import type { Room } from '../types/types';

interface LobbyProps {
  onEnterRoom: () => void;
  onLogout: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onEnterRoom, onLogout }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(ROOM_LIMITS.DEFAULT_MAX_PARTICIPANTS);
  const [createError, setCreateError] = useState('');
  const [previousRoomCount, setPreviousRoomCount] = useState(0);

  const { currentUser, clearUser } = useUser();
  const { toasts, removeToast, showInfo } = useToast();
  const { 
    connection, 
    availableRooms, 
    currentRoom,
    setCurrentRoom 
  } = useAppStore();
  
  const { 
    connect, 
    disconnect, 
    getRooms, 
    createRoom, 
    joinRoom 
  } = useWebSocket();

  // Detectar cambios en el número de salas para mostrar notificaciones
  useEffect(() => {
    if (previousRoomCount > 0 && availableRooms.length !== previousRoomCount) {
      if (availableRooms.length > previousRoomCount) {
        showInfo(`Nueva sala disponible! (${availableRooms.length} salas total)`, 2000);
      } else if (availableRooms.length < previousRoomCount) {
        showInfo(`Sala eliminada (${availableRooms.length} salas restantes)`, 2000);
      }
    }
    setPreviousRoomCount(availableRooms.length);
  }, [availableRooms.length, previousRoomCount, showInfo, setPreviousRoomCount]);

  useEffect(() => {
    // Solo conectar si no está conectado
    if (!connection.isConnected && !connection.isConnecting) {
      connect();
    }
  }, [connect, connection.isConnected, connection.isConnecting]);

  useEffect(() => {
    // Obtener salas inmediatamente cuando se conecta o cuando se carga el componente
    if (connection.isConnected) {
      getRooms();
    }
  }, [connection.isConnected, getRooms]);

  useEffect(() => {
    if (currentRoom) {
      onEnterRoom();
    }
  }, [currentRoom, onEnterRoom]);

  // Clear create error when connection error changes
  useEffect(() => {
    if (connection.error) {
      setCreateError('');
    }
  }, [connection.error]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    const trimmedName = roomName.trim();
    if (!trimmedName) {
      setCreateError('Por favor ingresa el nombre de la sala');
      return;
    }

    if (trimmedName.length < 3) {
      setCreateError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (maxParticipants < ROOM_LIMITS.MIN_PARTICIPANTS || maxParticipants > ROOM_LIMITS.MAX_PARTICIPANTS) {
      setCreateError(`Los participantes deben estar entre ${ROOM_LIMITS.MIN_PARTICIPANTS} y ${ROOM_LIMITS.MAX_PARTICIPANTS}`);
      return;
    }

    console.log('Creating room:', { name: trimmedName, maxUsers: maxParticipants });
    createRoom(trimmedName, maxParticipants);
    setIsCreateModalOpen(false);
    setRoomName('');
    setMaxParticipants(ROOM_LIMITS.DEFAULT_MAX_PARTICIPANTS);
  };

  const handleJoinRoom = (room: Room) => {
    if (room.currentParticipantsCount >= room.maxParticipants) {
      alert('La sala está llena');
      return;
    }
    joinRoom(room.id);
  };

  const handleLogout = () => {
    disconnect();
    clearUser();
    setCurrentRoom(null);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DrawTogether</h1>
              {currentUser && (
                <div className="flex items-center ml-6 px-3 py-2 bg-white/60 rounded-xl border border-white/30 shadow-sm">
                  <div
                    className="w-3 h-3 rounded-full mr-3 ring-2 ring-white shadow-sm"
                    style={{ backgroundColor: currentUser.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/60 rounded-xl border border-white/30 shadow-sm">
                <div className={`w-2 h-2 rounded-full ${connection.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {connection.isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Salas disponibles</h2>
            <p className="text-gray-600">Únete a una sala existente o crea una nueva</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Crear sala
          </Button>
        </div>

        {connection.error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{connection.error}</p>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        {availableRooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-6 shadow-lg">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No hay salas disponibles</h3>
            <p className="text-gray-600 mb-6">Crea una sala para comenzar a dibujar con otros</p>
            <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Crear mi primera sala
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.map((room) => (
              <div key={room.id} className={`
                bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 relative
                ${room.currentParticipantsCount >= room.maxParticipants 
                  ? 'opacity-75 border-red-200 bg-red-50/50' 
                  : room.currentParticipantsCount > 0 
                    ? 'border-green-200 bg-green-50/30' 
                    : 'hover:border-blue-200'
                }
              `}>
                {/* Indicador de estado */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                  room.currentParticipantsCount >= room.maxParticipants 
                    ? 'bg-red-500 shadow-lg shadow-red-200' 
                    : room.currentParticipantsCount > 0 
                      ? 'bg-green-500 shadow-lg shadow-green-200 animate-pulse' 
                      : 'bg-gray-300'
                }`} />
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 truncate pr-4">
                    {room.name}
                  </h3>
                  <div className="flex items-center text-sm font-medium px-2 py-1 rounded-lg bg-white/60 border border-white/30">
                    <Users className="w-4 h-4 mr-1" />
                    <span className={`${
                      room.currentParticipantsCount >= room.maxParticipants 
                        ? 'text-red-600' 
                        : room.currentParticipantsCount > 0 
                          ? 'text-green-600' 
                          : 'text-gray-600'
                    }`}>
                      {room.currentParticipantsCount}/{room.maxParticipants}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(room.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  
                  <Button
                    size="sm"
                    onClick={() => handleJoinRoom(room)}
                    disabled={room.currentParticipantsCount >= room.maxParticipants}
                    variant={room.currentParticipantsCount >= room.maxParticipants ? 'secondary' : 'primary'}
                    className="shadow-md"
                  >
                    {room.currentParticipantsCount >= room.maxParticipants ? 'Llena' : 'Unirse'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Room Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear nueva sala"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <Input
              label="Nombre de la sala"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Mi sala de dibujo"
              error={createError}
              maxLength={30}
              required
            />
          </div>

          <div>
            <Input
              label="Máximo de participantes"
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              min={ROOM_LIMITS.MIN_PARTICIPANTS}
              max={ROOM_LIMITS.MAX_PARTICIPANTS}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setCreateError('');
                setRoomName('');
                setMaxParticipants(ROOM_LIMITS.DEFAULT_MAX_PARTICIPANTS);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Crear sala
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};