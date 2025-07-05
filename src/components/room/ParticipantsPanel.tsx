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
    <div className={`bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-2xl ${className}`}>
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3 shadow-lg">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Participantes
        </h3>
        <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {currentRoom.currentParticipantsCount}/{currentRoom.maxParticipants}
        </span>
      </div>

      <div className="space-y-3">
        {currentRoom.participants.map((participantId, index) => {
          const isCurrentUser = participantId === currentUser?.id;
          const isRoomCreator = index === 0;
          
          return (
            <div
              key={participantId}
              className={`
                flex items-center p-4 rounded-xl transition-all duration-200 border-2
                ${isCurrentUser 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-center flex-1">
                {isRoomCreator ? (
                  <div className="p-1.5 bg-yellow-100 rounded-lg mr-3">
                    <Crown className="w-4 h-4 text-yellow-600" />
                  </div>
                ) : (
                  <div className="p-1.5 bg-gray-100 rounded-lg mr-3">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                
                <div className="flex items-center">
                  {isCurrentUser && currentUser?.color && (
                    <div
                      className="w-4 h-4 rounded-full mr-3 ring-2 ring-white shadow-md"
                      style={{ backgroundColor: currentUser.color }}
                    />
                  )}
                  
                  <div>
                    <span className={`text-sm font-semibold ${
                      isCurrentUser ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {isCurrentUser ? currentUser?.name || 'Tú' : `Usuario ${participantId.slice(-4)}`}
                    </span>
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-blue-600 font-medium">(Tú)</span>
                    )}
                  </div>
                </div>
              </div>

              {isRoomCreator && (
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-200 shadow-sm">
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
              className="flex items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-200"
            >
              <div className="p-1.5 bg-gray-200 rounded-lg mr-3">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Esperando participante...</span>
            </div>
          ))}
      </div>
    </div>
  );
};