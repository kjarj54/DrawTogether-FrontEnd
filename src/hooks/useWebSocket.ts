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
        currentUser
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
            case 'ROOMS_UPDATED':
                if (message.data?.rooms) {
                    setAvailableRooms(message.data.rooms);
                }
                break;

            case 'ROOM_CREATED':
                console.log('Room created successfully:', message.data);
                if (message.data?.rooms) {
                    setAvailableRooms(message.data.rooms);
                }
                // Refrescar la lista de salas
                setTimeout(() => {
                    sendMessage({ action: 'GET_ROOMS' });
                }, 100);
                break;

            case 'ROOM_JOINED':
                if (message.data) {
                    setCurrentRoom({
                        id: message.data.roomId,
                        name: message.data.roomName || '',
                        participants: message.data.participants || [],
                        maxParticipants: message.data.maxParticipants || 0,
                        currentParticipantsCount: message.data.participants?.length || 0,
                        createdAt: new Date().toISOString()
                    });

                    // Load draw events history
                    if (message.data.drawEvents) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        message.data.drawEvents.forEach((event: any) => addDrawEvent(event));
                    }
                }
                break;

            case 'DRAW_EVENT':
                if (message.data?.drawEvent) {
                    addDrawEvent(message.data.drawEvent);
                }
                break;

            case 'USER_JOINED':
            case 'USER_LEFT':
                // Handle user list updates
                console.log(message.type, message.data);
                break;

            case 'ERROR':
                console.error('WebSocket error:', message.message);
                setConnection({ error: message.message });
                break;

            default:
                console.log('Unhandled message type:', message.type);
        }
    }, [setAvailableRooms, setCurrentRoom, addDrawEvent, setConnection, sendMessage]);

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
    }, [sendMessage]);

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
    }, [handleMessage, setConnection]);

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