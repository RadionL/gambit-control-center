// Gambit Navigation System WebSocket Service

import { 
  WSMessage, 
  WSIndicatorsMessage, 
  WSRecordStatusMessage, 
  WSMissionStatusMessage,
  WSRecordDoneMessage 
} from '@/types';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
const RECONNECT_INTERVAL = 5000; // 5 seconds

type WSEventHandler<T = any> = (data: T) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private token: string | null = null;
  private eventHandlers: Map<string, WSEventHandler[]> = new Map();
  private isConnected = false;

  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `${WS_BASE_URL}/ws/indicators${this.token ? `?token=${this.token}` : ''}`;
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.clearReconnectTimer();
        this.emit('connection', { connected: true });
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.emit('connection', { connected: false });
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.emit('connection', { connected: false });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  private handleMessage(message: WSMessage): void {
    switch (message.event) {
      case 'indicators':
        this.emit('indicators', (message as WSIndicatorsMessage).data);
        break;
      case 'record_status':
        this.emit('record_status', (message as WSRecordStatusMessage).data);
        break;
      case 'mission_status':
        this.emit('mission_status', (message as WSMissionStatusMessage).data);
        break;
      case 'record_done':
        this.emit('record_done', (message as WSRecordDoneMessage).data);
        break;
      default:
        this.emit(message.event, message.data);
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in WebSocket event handler for ${event}:`, error);
      }
    });
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      this.connect();
    }, RECONNECT_INTERVAL);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // Event subscription methods
  on<T = any>(event: string, handler: WSEventHandler<T>): () => void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.push(handler);
    this.eventHandlers.set(event, handlers);

    // Return unsubscribe function
    return () => {
      const currentHandlers = this.eventHandlers.get(event) || [];
      const index = currentHandlers.indexOf(handler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
        this.eventHandlers.set(event, currentHandlers);
      }
    };
  }

  off(event: string, handler?: WSEventHandler): void {
    if (!handler) {
      this.eventHandlers.delete(event);
      return;
    }

    const handlers = this.eventHandlers.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.eventHandlers.set(event, handlers);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Convenience methods for specific events
  onIndicators(handler: WSEventHandler<WSIndicatorsMessage['data']>): () => void {
    return this.on('indicators', handler);
  }

  onRecordStatus(handler: WSEventHandler<WSRecordStatusMessage['data']>): () => void {
    return this.on('record_status', handler);
  }

  onMissionStatus(handler: WSEventHandler<WSMissionStatusMessage['data']>): () => void {
    return this.on('mission_status', handler);
  }

  onRecordDone(handler: WSEventHandler<WSRecordDoneMessage['data']>): () => void {
    return this.on('record_done', handler);
  }

  onConnection(handler: WSEventHandler<{ connected: boolean }>): () => void {
    return this.on('connection', handler);
  }
}

export const wsService = new WebSocketService();