import { GatewayMetadata } from '@nestjs/websockets';

export const gatewayConfig: GatewayMetadata = {
  namespace: 'chat',
  cors: { origin: '*' },
};
