import { useCallback, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { websocketService } from "../services/WebSocketService";
import type { WebSocketMessage } from "../types/types";

export const useWebSocket = () => {
    const {
        setConnection,
        setAvailableRooms,
        setCurrentRoom,
        addDrawEvent,
        currentUser,
        currentRoom
    } = useAppStore();

    const connect = useCallback(async () => {
        try {
            setConnection({ isConnected: true, error: null });
            await websocketService.connect();
            setConnection({ isConnected: true, isConnecting: false });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setConnection({
                isConnected: false,
                isConnecting: false,
                error: 'Failed to connect'
            });
        }
    }, [setConnection]);

    const disconnect = useCallback(
        () => {
            websocketService.disconnect();
            setConnection({ isConnected: false, isConnecting: false, error: null });
        }, [setConnection]
    );

    const sendMessage = useCallback(
        (data: object) => {
            websocketService.send(data);
        }, []
    );

    const handleMessage = useCallback((message: WebSocketMessage) => {
        switch (message.type) {
            case 'CONNECTION_ESTABLISHED':
                console.log('Connected to server');
                break;

            case 'ROOMS_LIST':
                if (message.data?.rooms) {
                    setAvailableRooms(message.data.rooms);
                    console.log('Rooms list received:', message.data.rooms.length, 'rooms');
                }
                break;

            case 'ROOMS_UPDATED':
                if (message.data?.rooms) {
                    setAvailableRooms(message.data.rooms);
                    console.log('Rooms updated in real-time:', message.data.rooms.length, 'rooms');
                }
                break;

            case 'ROOM_CREATED':
                console.log('Room created successfully:', message.data);
                // No necesitamos refrescar manualmente, el servidor envía ROOMS_UPDATED automáticamente
                break;

            case 'ROOM_JOINED':
                if (message.data) {
                    console.log('ROOM_JOINED full data:', JSON.stringify(message.data, null, 2));
                    
                    const maxParticipants = message.data.maxParticipants;
                    const currentParticipantsCount = message.data.currentParticipantsCount;
                    
                    console.log('Extracted values - maxParticipants:', maxParticipants, 'currentParticipantsCount:', currentParticipantsCount);
                    
                    setCurrentRoom({
                        id: message.data.roomId,
                        name: message.data.roomName || '',
                        participants: message.data.participants || [],
                        maxParticipants: Number(maxParticipants) || 2, // Default fallback to 2
                        currentParticipantsCount: Number(currentParticipantsCount) || 0,
                        createdAt: new Date().toISOString()
                    });

                    console.log('Joined room with participants:', currentParticipantsCount, 'of', maxParticipants);

                    // Load draw events history
                    if (message.data.drawEvents) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        message.data.drawEvents.forEach((event: any) => addDrawEvent(event));
                    }
                }
                break;

            case 'DRAW_EVENT':
                if (message.data) {
                    // El backend envía los datos directamente en message.data
                    const drawEvent = {
                        id: message.data.eventId,
                        userId: message.data.userId,
                        type: message.data.type,
                        timestamp: message.data.timestamp,
                        roomId: '', // Se puede obtener del contexto si es necesario
                        drawData: message.data.drawData
                    };
                    addDrawEvent(drawEvent);
                }
                break;

            case 'USER_JOINED':
                console.log('USER_JOINED data:', message.data);
                // Si estamos en la misma sala, actualizar participantes
                if (currentRoom && message.data?.roomId === currentRoom.id) {
                    setCurrentRoom({
                        ...currentRoom,
                        maxParticipants: Number(message.data.maxParticipants) || currentRoom.maxParticipants,
                        currentParticipantsCount: message.data.currentParticipantsCount || 0,
                        participants: message.data.participants || currentRoom.participants
                    });
                    console.log('Updated participants count:', message.data.currentParticipantsCount, 'maxParticipants preserved:', currentRoom.maxParticipants);
                }
                break;

            case 'USER_LEFT':
                console.log('USER_LEFT data:', message.data);
                // Si estamos en la misma sala, actualizar participantes
                if (currentRoom && message.data?.roomId === currentRoom.id) {
                    setCurrentRoom({
                        ...currentRoom,
                        maxParticipants: Number(message.data.maxParticipants) || currentRoom.maxParticipants,
                        currentParticipantsCount: message.data.currentParticipantsCount || 0,
                        participants: message.data.participants || currentRoom.participants
                    });
                    console.log('Updated participants count after user left:', message.data.currentParticipantsCount, 'maxParticipants:', message.data.maxParticipants);
                }
                break;

            case 'ROOM_LEFT':
                console.log('Left room successfully');
                setCurrentRoom(null);
                break;

            case 'ERROR':
                console.error('WebSocket error:', message.message);
                setConnection({ error: message.message });
                break;

            default:
                console.log('Unhandled message type:', message.type);
        }
    }, [setAvailableRooms, setCurrentRoom, addDrawEvent, setConnection, currentRoom]);

    const createRoom = useCallback((roomName: string, maxUsers: number) => {
        sendMessage({
            action: 'CREATE_ROOM',
            roomName,
            maxUsers
        });
    }, [sendMessage]);

    const joinRoom = useCallback((roomId: string) => {
        if (!currentUser) {
            console.error('No current user set');
            return;
        }

        sendMessage({
            action: 'JOIN_ROOM',
            roomId,
            userId: currentUser.id
        });
    }, [sendMessage, currentUser]);

    const leaveRoom = useCallback(() => {
        sendMessage({
            action: 'LEAVE_ROOM'
        });
        // Limpiar el estado local inmediatamente
        setCurrentRoom(null);
    }, [sendMessage, setCurrentRoom]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendDrawEvent = useCallback((eventData: any) => {
        sendMessage({
            action: 'DRAW_EVENT',
            eventData
        });
    }, [sendMessage]);

    const getRooms = useCallback(() => {
        sendMessage({
            action: 'GET_ROOMS'
        });
    }, [sendMessage]);

    // Setup event listeners
    useEffect(() => {
        const unsubscribeMessage = websocketService.onMessage(handleMessage);

        const unsubscribeOpen = websocketService.onOpen(() => {
            setConnection({ isConnected: true, isConnecting: false, error: null });
            // Automáticamente solicitar salas cuando se establece la conexión
            setTimeout(() => {
                sendMessage({ action: 'GET_ROOMS' });
            }, 100);
        });

        const unsubscribeClose = websocketService.onClose(() => {
            setConnection({ isConnected: false, isConnecting: false, error: null });
        });

        const unsubscribeError = websocketService.onError(() => {
            setConnection({
                isConnected: false,
                isConnecting: false,
                error: 'Connection error'
            });
        });

        return () => {
            unsubscribeMessage();
            unsubscribeOpen();
            unsubscribeClose();
            unsubscribeError();
        };
    }, [handleMessage, setConnection, sendMessage]);

    return {
        connect,
        disconnect,
        createRoom,
        joinRoom,
        leaveRoom,
        sendDrawEvent,
        getRooms
    };
};