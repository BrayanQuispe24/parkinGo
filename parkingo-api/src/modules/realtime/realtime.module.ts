import { Global, Module } from '@nestjs/common';
import { EspaciosRealtimeGateway } from './gateways/espacios-realtime.gateway.js';
import { EspaciosRealtimeService } from './services/espacios-realtime.service.js';

@Global()
@Module({
  providers: [EspaciosRealtimeGateway, EspaciosRealtimeService],
  exports: [EspaciosRealtimeService],
})
export class RealtimeModule {}

