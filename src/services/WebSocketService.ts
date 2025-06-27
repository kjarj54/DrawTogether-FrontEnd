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
                    this.attemptReconnect();
                }

                this.ws.onerror = (event) => {
                    this.errorHandlers.forEach(handler => handler(event));
                    reject(event);
                }


            } catch (error) {
                reject(error);
            }
        });
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(
                () => {
                    console.log(`Roconnect attempt ${this.reconnectAttempts}`);
                    this.connect();
                }, this.reconnectDelay * this.reconnectAttempts
            );

        }
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    send(data: object): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected');
        }
    }

    onMessage(handler: MessageHandler): () => void {
        this.messageHandlers.push(handler);
        return () => {
            this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
        };
    }

    onOpen(handler: ConnectionHandler): () => void {
        this.openHandlers.push(handler);
        return () => {
            this.openHandlers = this.openHandlers.filter(h => h !== handler);
        };
    }

    onClose(handler: ConnectionHandler): () => void {
        this.closeHandlers.push(handler);
        return () => {
            this.closeHandlers = this.closeHandlers.filter(h => h !== handler);
        };
    }

    onError(handler: ErrorHandler): () => void {
        this.errorHandlers.push(handler);
        return () => {
            this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
        };
    }

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

}


export const websocketService = new WebSocketService('ws://localhost:8080')