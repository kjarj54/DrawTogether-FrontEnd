import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useAppStore } from '../store/useAppStore';

// Re-export the main store for backward compatibility
export const useStore = useAppStore;

// You can add additional specialized stores here if needed
interface DrawingState {
  currentTool: 'brush' | 'eraser';
  currentColor: string;
  strokeWidth: number;
  
  setCurrentTool: (tool: 'brush' | 'eraser') => void;
  setCurrentColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
}

export const useDrawingStore = create<DrawingState>()(
  subscribeWithSelector((set) => ({
    currentTool: 'brush',
    currentColor: '#000000',
    strokeWidth: 3,
    
    setCurrentTool: (tool) => set({ currentTool: tool }),
    setCurrentColor: (color) => set({ currentColor: color }),
    setStrokeWidth: (width) => set({ strokeWidth: width }),
  }))
);