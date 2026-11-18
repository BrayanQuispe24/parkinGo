import { io, type Socket } from 'socket.io-client';
import { BACKEND_URL } from '../api/parkingoApi';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from './realtimeEvents';

export type ParkingoRealtimeSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

let socketInstance: ParkingoRealtimeSocket | null = null;
let activeSubscribers = 0;

export function getRealtimeSocket(): ParkingoRealtimeSocket {
  if (!socketInstance) {
    socketInstance = io(`${BACKEND_URL}/realtime`, {
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      withCredentials: true,
      auth: (cb: (data: { token: string | null }) => void) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('parkingo_token') : null;
        cb({ token });
      },
    });
  }
  return socketInstance;
}

export function retainRealtimeSocket(): ParkingoRealtimeSocket {
  const socket = getRealtimeSocket();
  activeSubscribers += 1;
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function releaseRealtimeSocket(): void {
  activeSubscribers = Math.max(0, activeSubscribers - 1);
  if (activeSubscribers === 0 && socketInstance?.connected) {
    socketInstance.disconnect();
  }
}

