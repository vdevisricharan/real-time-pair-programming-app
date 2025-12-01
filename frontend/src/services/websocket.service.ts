import type { WebSocketMessage } from '../types';

const WS_BASE = import.meta.env.VITE_WS_BASE || 'ws://localhost:8000';

export class WebSocketService {
  private ws: WebSocket | null = null;

  connect(
    roomId: string,
    onMessage: (data: WebSocketMessage) => void,
    onOpen: () => void,
    onClose: () => void,
    onError: (error: Event) => void
  ): void {
    // Close existing connection
    this.disconnect();

    this.ws = new WebSocket(`${WS_BASE}/ws/${roomId}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      onOpen();
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError(error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      onClose();
    };
  }

  sendMessage(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open. Message not sent:', message);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();