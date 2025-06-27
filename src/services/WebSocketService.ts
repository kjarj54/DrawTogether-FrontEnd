import type { WebSocketMessage } from "../types/types";

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = (error: Event) => void;
type ErrorHandler = (error: Event) => void;

export class WebSocketService {
    private ws: WebSocket | null = null;
    private url: string;
    private messageHandlers: MessageHandler[] = [];
    private openHandlers: ConnectionHandler[] = [];
    private closeHandlers: ConnectionHandler[] = [];
    private errorHandlers: ErrorHandler[] = [];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    constructor(url: string) {
        this.url = url;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);

                this.ws.onopen = (event) => {
                    this.reconnectAttempts = 0;
                    this.openHandlers.forEach(handler => handler(event));
                    resolve();
                }

                this.ws.onmessage = (event) => {
                    try {
                        const message: WebSocketMessage = JSON.parse(event.data);
                        this.messageHandlers.forEach(handler => handler(message));
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                }

                this.ws.onclose = (event) => {
                    this.closeHandlers.forEach(handler => handler(event));
                    this.
                }


            } catch (error) {
                reject(error);
            }
        })
    }
}


export const websocketService = new WebSocketService('ws://localhost:8080')