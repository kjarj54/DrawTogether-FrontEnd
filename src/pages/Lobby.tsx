import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAppStore } from '../store/useAppStore';
import { useUser } from '../hooks/useUser';
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

  const { currentUser, clearUser } = useUser();
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

  useEffect(() => {
    if (!connection.isConnected) {
      connect();
    }
  }, [connect, connection.isConnected]);

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">DrawTogether</h1>
              {currentUser && (
                <div className="flex items-center" style={{marginLeft: '24px'}}>
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: currentUser.color }}
                  />
                  <span className="text-sm text-gray-600">{currentUser.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`status-dot ${connection.isConnected ? 'status-online' : 'status-offline'}`} />
                <span className="text-sm text-gray-600">
                  {connection.isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Salas disponibles</h2>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear sala
          </Button>
        </div>

        {connection.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-500">{connection.error}</p>
          </div>
        )}

        {/* Rooms Grid */}
        {availableRooms.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-600" style={{margin: '0 auto 16px'}} />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No hay salas disponibles</h3>
            <p className="text-gray-600">Crea una sala para comenzar a dibujar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.map((room) => (
              <div key={room.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900" style={{maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {room.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {room.currentParticipantsCount}/{room.maxParticipants}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Creada: {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                  
                  <Button
                    size="sm"
                    onClick={() => handleJoinRoom(room)}
                    disabled={room.currentParticipantsCount >= room.maxParticipants}
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

          <div className="flex justify-between" style={{marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e2e8f0'}}>
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
    </div>
  );
};