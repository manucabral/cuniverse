import { GatewayMetadata } from '@nestjs/websockets';

export const gatewayConfig: GatewayMetadata = {
  namespace: 'game',
  cors: { origin: '*' },
};
