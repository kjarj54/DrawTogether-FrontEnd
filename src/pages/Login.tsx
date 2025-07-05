import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../hooks/useUser';
import { useWebSocket } from '../hooks/useWebSocket';
import { DEFAULT_COLORS } from '../constants/Constants';

interface UserSetupProps {
  onUserReady: () => void;
}

export const UserSetup: React.FC<UserSetupProps> = ({ onUserReady }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [error, setError] = useState('');
  const { currentUser, createUser, loadUserFromStorage, updateUserColor } = useUser();
  const { connect } = useWebSocket();

  useEffect(() => {
    // Intentar cargar usuario existente
    const existingUser = loadUserFromStorage();
    if (existingUser) {
      setName(existingUser.name);
      setSelectedColor(existingUser.color || DEFAULT_COLORS[0]);
    }
  }, [loadUserFromStorage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (trimmedName.length > 20) {
      setError('El nombre no puede tener más de 20 caracteres');
      return;
    }

    try {
      if (currentUser) {
        // Actualizar usuario existente
        updateUserColor(selectedColor);
      } else {
        // Crear nuevo usuario
        createUser(trimmedName);
      }
      
      // Conectar al WebSocket automáticamente después de crear/actualizar usuario
      connect();
      
      onUserReady();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Error al crear el usuario. Inténtalo de nuevo.');
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (currentUser) {
      updateUserColor(color);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">DrawTogether</h1>
          <p className="text-gray-600">Colabora y dibuja en tiempo real</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre"
            error={error}
            maxLength={20}
            required
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Elige tu color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`
                    w-12 h-12 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200
                    ${selectedColor === color 
                      ? 'ring-4 ring-gray-800 scale-110 shadow-lg' 
                      : 'ring-2 ring-gray-200 hover:ring-gray-300 shadow-md'
                    }
                  `}
                  style={{ backgroundColor: color }}
                  aria-label={`Seleccionar color ${color}`}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {currentUser ? 'Actualizar perfil' : 'Comenzar a dibujar'}
          </Button>
        </form>

        {currentUser && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-700 font-medium">
              <span className="font-semibold">Usuario actual:</span> {currentUser.name}
            </p>
            <div className="flex items-center mt-2">
              <div
                className="w-4 h-4 rounded-full mr-2 ring-2 ring-white shadow-sm"
                style={{ backgroundColor: currentUser.color }}
              />
              <span className="text-sm text-gray-600">Color: {currentUser.color}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};