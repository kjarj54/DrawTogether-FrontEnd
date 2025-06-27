export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export const DRAW_TOOLS = {
  BRUSH: 'brush',
  ERASER: 'eraser'
} as const;

export const DRAW_EVENT_TYPES = {
  STROKE_START: 'STROKE_START',
  STROKE_MOVE: 'STROKE_MOVE',
  STROKE_END: 'STROKE_END',
  CLEAR_CANVAS: 'CLEAR_CANVAS',
  UNDO: 'UNDO',
  REDO: 'REDO'
} as const;

export const DEFAULT_COLORS = [
  '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'
];

export const DEFAULT_STROKE_WIDTH = 3;
export const MIN_STROKE_WIDTH = 1;
export const MAX_STROKE_WIDTH = 20;

export const ROOM_LIMITS = {
  MIN_PARTICIPANTS: 2,
  MAX_PARTICIPANTS: 20,
  DEFAULT_MAX_PARTICIPANTS: 5
} as const;