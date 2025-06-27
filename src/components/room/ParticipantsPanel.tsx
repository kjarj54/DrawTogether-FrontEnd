import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useUser } from '../../hooks/useUser';
import { Users, Crown, User } from 'lucide-react';

interface ParticipantsPanelProps {
  className?: string;
}

export const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({ className = '' }) => {
  const { currentRoom } = useAppStore();
  const { currentUser } = useUser();

  if (!currentRoom) return null;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Participantes ({currentRoom.currentParticipantsCount}/{currentRoom.maxParticipants})
        </h3>
      </div>

      <div className="space-y-3">
        {currentRoom.participants.map((participantId, index) => {
          const isCurrentUser = participantId === currentUser?.id;
          const isRoomCreator = index === 0; // Primer participante es el creador
          
          return (
            <div
              key={participantId}
              className={`flex items-center p-3 rounded-lg ${
                isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center flex-1">
                {isRoomCreator ? (
                  <Crown className="w-4 h-4 text-yellow-500 mr-2" />
                ) : (
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                )}
                
                <div className="flex items-center">
                  {/* Color del usuario (si está disponible) */}
                  {isCurrentUser && currentUser?.color && (
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: currentUser.color }}
                    />
                  )}
                  
                  <span className={`text-sm font-medium ${
                    isCurrentUser ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {isCurrentUser ? currentUser?.name || 'Tú' : `Usuario ${participantId.slice(-4)}`}
                    {isCurrentUser && ' (Tú)'}
                  </span>
                </div>
              </div>

              {isRoomCreator && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Anfitrión
                </span>
              )}
            </div>
          );
        })}

        {/* Espacios vacíos */}
        {Array.from({ length: currentRoom.maxParticipants - currentRoom.currentParticipantsCount })
          .map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex items-center p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
            >
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">Esperando participante...</span>
            </div>
          ))}
      </div>
    </div>
  );
};