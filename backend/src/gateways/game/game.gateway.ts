import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'game',
  cors: { origin: '*' },
})
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(GameGateway.name);

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }
}
