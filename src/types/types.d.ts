export interface User {
  id: string;
  name: string;
  color?: string;
}

export interface Room {
  id: string;
  name: string;
  maxParticipants: number;
  currentParticipantsCount: number;
  participants: string[];
  createdAt: string;
}

export interface DrawData {
  x: number;
  y: number;
  color: string;
  strokeWidth: number;
  tool: 'brush' | 'eraser';
}

export interface DrawEvent {
  id: string;
  roomId: string;
  userId: string;
  timestamp: string;
  type: 'STROKE_START' | 'STROKE_MOVE' | 'STROKE_END' | 'CLEAR_CANVAS' | 'UNDO' | 'REDO';
  drawData?: DrawData;
}

export interface WebSocketMessage {
  type: string;
  message: string;
  timestamp: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface AppState{
    connection: ConnectionState;

    currentUser: User | null;

    currentRoom: Room | null;
    availableRooms: Room[];

    drawEvents: DrawEvent[];
    isDrawing: boolean;

    setConnection: (state: Partial<ConnectionState>) => void;
    setCurrentUser: (user: User | null) => void;
    setCurrentRoom: (room: Room | null) => void;
    setAvailableRooms: (rooms: Room[]) => void;
    addDrawEvent: (event: DrawEvent) => void;
    clearDrawEvents: () => void;
    setIsDrawing: (isDrawing: boolean) => void;
    resetState: () => void;

    
}