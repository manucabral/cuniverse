import { GatewayMetadata } from '@nestjs/websockets';

export const gatewayConfig: GatewayMetadata = {
  namespace: 'lobby',
  cors: { origin: '*' },
};
