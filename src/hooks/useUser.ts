import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore } from '../store/useAppStore';
import { DEFAULT_COLORS } from '../constants/Constants';
import type { User } from '../types/types';

export const useUser = () => {
  const { currentUser, setCurrentUser } = useAppStore();

  const createUser = useCallback((name: string): User => {
    const randomColor = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
    
    const user: User = {
      id: uuidv4(),
      name: name.trim(),
      color: randomColor,
    };

    setCurrentUser(user);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('drawTogether_user', JSON.stringify(user));
    
    return user;
  }, [setCurrentUser]);

  const loadUserFromStorage = useCallback((): User | null => {
    try {
      const storedUser = localStorage.getItem('drawTogether_user');
      if (storedUser) {
        const user = JSON.parse(storedUser) as User;
        setCurrentUser(user);
        return user;
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem('drawTogether_user');
    }
    return null;
  }, [setCurrentUser]);

  const clearUser = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('drawTogether_user');
  }, [setCurrentUser]);

  const updateUserColor = useCallback((color: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, color };
      setCurrentUser(updatedUser);
      localStorage.setItem('drawTogether_user', JSON.stringify(updatedUser));
    }
  }, [currentUser, setCurrentUser]);

  return {
    currentUser,
    createUser,
    loadUserFromStorage,
    clearUser,
    updateUserColor,
  };
};