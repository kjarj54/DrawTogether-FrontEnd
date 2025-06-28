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
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #e0f2fe 0%, #bbdefb 100%)'}}>
      <div className="bg-white rounded-lg shadow p-6 w-full" style={{maxWidth: '400px'}}>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DrawTogether</h1>
          <p className="text-gray-600">Colabora y dibuja en tiempo real</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="text-sm font-bold text-gray-900 mb-3" style={{display: 'block'}}>
              Elige tu color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`rounded-full cursor-pointer`}
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: color,
                    border: selectedColor === color ? '4px solid #1a202c' : '4px solid #e2e8f0',
                    transition: 'all 0.2s ease-in-out',
                    transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: selectedColor === color ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedColor !== color) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.borderColor = '#cbd5e0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedColor !== color) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
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
          <div className="bg-gray-50 rounded-lg p-4" style={{marginTop: '24px'}}>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Usuario actual:</span> {currentUser.name}
            </p>
            <div className="flex items-center" style={{marginTop: '8px'}}>
              <div
                className="w-4 h-4 rounded-full mr-2"
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