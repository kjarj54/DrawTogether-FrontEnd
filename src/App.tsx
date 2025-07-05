import { useState, useEffect } from 'react';
import { UserSetup } from './pages/Login'; 
import { Lobby } from './pages/Lobby';
import { Room } from './pages/Room';
import { useUser } from './hooks/useUser';
import { useAppStore } from './store/useAppStore';
import { useWebSocket } from './hooks/useWebSocket';

type AppState = 'setup' | 'lobby' | 'room';

function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const { loadUserFromStorage } = useUser();
  const { currentRoom, connection } = useAppStore();
  const { connect, getRooms } = useWebSocket();

  useEffect(() => {
    // Intentar cargar usuario existente al iniciar
    const existingUser = loadUserFromStorage();
    if (existingUser) {
      setAppState('lobby');
      // Conectar automáticamente al WebSocket cuando hay un usuario
      connect();
    }
  }, [loadUserFromStorage, connect]);

  // Obtener salas cuando se establece la conexión
  useEffect(() => {
    if (connection.isConnected && appState === 'lobby') {
      getRooms();
    }
  }, [connection.isConnected, appState, getRooms]);

  useEffect(() => {
    // Cambiar a room cuando se una a una sala
    if (currentRoom && appState !== 'room') {
      setAppState('room');
    }
  }, [currentRoom, appState]);

  const handleUserReady = () => {
    setAppState('lobby');
  };

  const handleEnterRoom = () => {
    setAppState('room');
  };

  const handleLeaveRoom = () => {
    setAppState('lobby');
  };

  const handleLogout = () => {
    setAppState('setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {appState === 'setup' && (
        <UserSetup onUserReady={handleUserReady} />
      )}
      
      {appState === 'lobby' && (
        <Lobby 
          onEnterRoom={handleEnterRoom}
          onLogout={handleLogout}
        />
      )}
      
      {appState === 'room' && (
        <Room onLeaveRoom={handleLeaveRoom} />
      )}
    </div>
  );
}

export default App;