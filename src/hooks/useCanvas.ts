import { useCallback, useEffect, useRef, useState } from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import { useWebSocket } from './useWebSocket';
import { useAppStore } from '../store/useAppStore';
import { DRAW_EVENT_TYPES } from '../constants/Constants';
import type { DrawData, DrawEvent } from '../types/types';

interface Point {
    x: number;
    y: number;
}

interface CanvasState {
    isDrawing: boolean;
    lastPoint: Point | null;
    currentPath: Point[];
}

export const useCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [canvasState, setCanvasState] = useState<CanvasState>({
        isDrawing: false,
        lastPoint: null,
        currentPath: []
    });

    const { currentTool, currentColor, strokeWidth } = useDrawingStore();
    const { sendDrawEvent } = useWebSocket();
    const { currentUser, currentRoom, drawEvents, setIsDrawing } = useAppStore();

    // Inicializar canvas
    const initializeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Configuración del canvas
        const rect = canvas.getBoundingClientRect();
        const devicePixelRatio = window.devicePixelRatio || 1;

        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;

        context.scale(devicePixelRatio, devicePixelRatio);

        // Configuración del contexto
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.globalCompositeOperation = 'source-over';

        // Fondo blanco
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        contextRef.current = context;
    }, []);

    // Obtener coordenadas del punto
    const getPointFromEvent = useCallback((event: MouseEvent | TouchEvent): Point => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();

        if ('touches' in event) {
            // Touch event
            const touch = event.touches[0] || event.changedTouches[0];
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        } else {
            // Mouse event
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }
    }, []);

    // Dibujar línea en el canvas
    const drawLine = useCallback((
        from: Point,
        to: Point,
        color: string,
        width: number,
        tool: 'brush' | 'eraser'
    ) => {
        const context = contextRef.current;
        if (!context) return;

        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);

        if (tool === 'eraser') {
            context.globalCompositeOperation = 'destination-out';
            context.lineWidth = width * 2; // Eraser más ancho
        } else {
            context.globalCompositeOperation = 'source-over';
            context.strokeStyle = color;
            context.lineWidth = width;
        }

        context.stroke();
    }, []);

    // Comenzar a dibujar
    const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
        if (!currentUser || !currentRoom) return;

        const point = getPointFromEvent(event);

        setCanvasState(prev => ({
            ...prev,
            isDrawing: true,
            lastPoint: point,
            currentPath: [point]
        }));

        setIsDrawing(true);

        // Enviar evento STROKE_START
        const drawData: DrawData = {
            x: point.x,
            y: point.y,
            color: currentColor,
            strokeWidth,
            tool: currentTool
        };

        sendDrawEvent({
            type: DRAW_EVENT_TYPES.STROKE_START,
            drawData
        });
    }, [currentUser, currentRoom, currentColor, strokeWidth, currentTool, getPointFromEvent, sendDrawEvent, setIsDrawing]);

    // Dibujar mientras se mueve
    const draw = useCallback((event: MouseEvent | TouchEvent) => {
        if (!canvasState.isDrawing || !canvasState.lastPoint || !currentUser) return;

        event.preventDefault();
        const currentPoint = getPointFromEvent(event);

        // Dibujar localmente
        drawLine(canvasState.lastPoint, currentPoint, currentColor, strokeWidth, currentTool);

        // Enviar evento STROKE_MOVE
        const drawData: DrawData = {
            x: currentPoint.x,
            y: currentPoint.y,
            color: currentColor,
            strokeWidth,
            tool: currentTool
        };

        sendDrawEvent({
            type: DRAW_EVENT_TYPES.STROKE_MOVE,
            drawData
        });

        setCanvasState(prev => ({
            ...prev,
            lastPoint: currentPoint,
            currentPath: [...prev.currentPath, currentPoint]
        }));
    }, [canvasState.isDrawing, canvasState.lastPoint, currentUser, currentColor, strokeWidth, currentTool, getPointFromEvent, drawLine, sendDrawEvent]);

    // Terminar de dibujar
    const stopDrawing = useCallback(() => {
        if (!canvasState.isDrawing || !currentUser) return;

        setCanvasState(prev => ({
            ...prev,
            isDrawing: false,
            lastPoint: null,
            currentPath: []
        }));

        setIsDrawing(false);

        // Enviar evento STROKE_END
        sendDrawEvent({
            type: DRAW_EVENT_TYPES.STROKE_END,
            drawData: {
                x: 0,
                y: 0,
                color: currentColor,
                strokeWidth,
                tool: currentTool
            }
        });
    }, [canvasState.isDrawing, currentUser, currentColor, strokeWidth, currentTool, sendDrawEvent, setIsDrawing]);

    // Limpiar canvas
    const clearCanvas = useCallback(() => {
        const context = contextRef.current;
        const canvas = canvasRef.current;
        if (!context || !canvas || !currentUser) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        sendDrawEvent({
            type: DRAW_EVENT_TYPES.CLEAR_CANVAS
        });
    }, [currentUser, sendDrawEvent]);

    // Renderizar eventos de dibujo remotos
    const renderDrawEvent = useCallback((event: DrawEvent) => {
        if (!event.drawData) return;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { drawData } = event;

        switch (event.type) {
            case 'STROKE_START':
                // Marcar inicio de trazo
                break;

            case 'STROKE_MOVE':
                // Solo renderizar si tenemos punto anterior
                // En una implementación real necesitarías almacenar los puntos anteriores por usuario
                break;

            case 'CLEAR_CANVAS':
                {
                    const context = contextRef.current;
                    const canvas = canvasRef.current;
                    if (context && canvas) {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.fillStyle = '#ffffff';
                        context.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    break;
                }
        }
    }, []);

    // Escuchar eventos de dibujo
    useEffect(() => {
        const latestEvent = drawEvents[drawEvents.length - 1];
        if (latestEvent && latestEvent.userId !== currentUser?.id) {
            renderDrawEvent(latestEvent);
        }
    }, [drawEvents, currentUser?.id, renderDrawEvent]);

    // Event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch events
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [startDrawing, draw, stopDrawing]);

    // Inicializar al montar
    useEffect(() => {
        initializeCanvas();
    }, [initializeCanvas]);

    // Redimensionar al cambiar tamaño
    useEffect(() => {
        const handleResize = () => {
            initializeCanvas();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [initializeCanvas]);

    return {
        canvasRef,
        clearCanvas,
        isDrawing: canvasState.isDrawing
    };
};