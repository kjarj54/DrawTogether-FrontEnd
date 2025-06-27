import React, { useState, useEffect } from 'react';
import { UserSetup } from './pages/Login'; 
import { Lobby } from './pages/Lobby';
import { Room } from './pages/Room';
import { useUser } from './hooks/useUser';
import { useAppStore } from './store/useAppStore';
import './index.css';

type AppState = 'setup' | 'lobby' | 'room';

function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentUser, loadUserFromStorage } = useUser();
  const { currentRoom } = useAppStore();

  useEffect(() => {
    // Intentar cargar usuario existente al iniciar
    const existingUser = loadUserFromStorage();
    if (existingUser) {
      setAppState('lobby');
    }
  }, [loadUserFromStorage]);

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
    <div className="min-h-screen">
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