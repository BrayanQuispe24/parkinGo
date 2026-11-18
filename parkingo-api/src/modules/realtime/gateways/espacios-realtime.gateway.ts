import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { EspacioRealtimeEventDto } from '../dto/espacio-realtime-event.dto.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const REALTIME_ROOMS = {
  CATALOGO_ESPACIOS: 'catalogo:espacios',
  parkingRoom: (estacionamientoId: string): string =>
    `parking:${estacionamientoId}`,
} as const;

export const REALTIME_EVENTS = {
  ESPACIO_ACTUALIZADO: 'espacio:actualizado',
} as const;

interface JoinParkingPayload {
  estacionamientoId?: unknown;
}

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

function resolveAllowedOrigins(): string[] {
  const configured = (process.env.FRONTEND_ORIGINS || process.env.CORS_ORIGINS)
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configured && configured.length > 0
    ? configured
    : DEFAULT_ALLOWED_ORIGINS;
}

@WebSocketGateway({
  namespace: '/realtime',
  transports: ['websocket', 'polling'],
  cors: {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowed = resolveAllowedOrigins();
      if (allowed.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origen no permitido por CORS WebSocket'), false);
    },
    credentials: true,
  },
})
export class EspaciosRealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(EspaciosRealtimeGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  private server!: Server;

  async handleConnection(client: Socket): Promise<void> {
    const rawToken =
      typeof client.handshake.auth?.token === 'string'
        ? client.handshake.auth.token
        : typeof client.handshake.headers?.authorization === 'string' &&
            client.handshake.headers.authorization.startsWith('Bearer ')
          ? client.handshake.headers.authorization.slice(7).trim()
          : undefined;

    if (rawToken) {
      try {
        const payload = await this.jwtService.verifyAsync<{
          sub: string;
          roleId: string;
          roleName?: string;
        }>(rawToken);
        client.data.user = payload;
      } catch {
        this.logger.warn(`Token JWT inválido en handshake WebSocket para cliente: ${client.id}`);
      }
    }

    this.logger.debug(`Cliente conectado a /realtime: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.debug(`Cliente desconectado de /realtime: ${client.id}`);
  }

  @SubscribeMessage('room:join-catalogo')
  async handleJoinCatalogo(
    @ConnectedSocket() client: Socket,
  ): Promise<{ joined: string }> {
    await client.join(REALTIME_ROOMS.CATALOGO_ESPACIOS);
    return { joined: REALTIME_ROOMS.CATALOGO_ESPACIOS };
  }

  @SubscribeMessage('room:leave-catalogo')
  async handleLeaveCatalogo(
    @ConnectedSocket() client: Socket,
  ): Promise<{ left: string }> {
    await client.leave(REALTIME_ROOMS.CATALOGO_ESPACIOS);
    return { left: REALTIME_ROOMS.CATALOGO_ESPACIOS };
  }

  @SubscribeMessage('room:join-parking')
  async handleJoinParking(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinParkingPayload,
  ): Promise<{ joined: string | null }> {
    const id =
      typeof payload?.estacionamientoId === 'string'
        ? payload.estacionamientoId.trim()
        : '';
    if (!id || !UUID_REGEX.test(id)) {
      return { joined: null };
    }
    const room = REALTIME_ROOMS.parkingRoom(id);
    await client.join(room);
    return { joined: room };
  }

  @SubscribeMessage('room:leave-parking')
  async handleLeaveParking(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinParkingPayload,
  ): Promise<{ left: string | null }> {
    const id =
      typeof payload?.estacionamientoId === 'string'
        ? payload.estacionamientoId.trim()
        : '';
    if (!id || !UUID_REGEX.test(id)) {
      return { left: null };
    }
    const room = REALTIME_ROOMS.parkingRoom(id);
    await client.leave(room);
    return { left: room };
  }

  emitEspacioActualizado(event: EspacioRealtimeEventDto): void {
    if (!this.server) {
      return;
    }
    const rooms = [
      REALTIME_ROOMS.parkingRoom(event.estacionamientoId),
      REALTIME_ROOMS.CATALOGO_ESPACIOS,
    ];
    this.server.to(rooms).emit(REALTIME_EVENTS.ESPACIO_ACTUALIZADO, event);
  }
}

