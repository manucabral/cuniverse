import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { gatewayConfig } from './game.gateway.config';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(gatewayConfig)
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(GameGateway.name);
  private createdAt: number = Date.now();

  afterInit(server: Server) {
    const took = Date.now() - this.createdAt;
    this.logger.log(`Initialized in ${took}ms`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
