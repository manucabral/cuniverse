import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { gatewayConfig } from './chat.gateway.config';
import { Server } from 'socket.io';

@WebSocketGateway(gatewayConfig)
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private createdAt: number = Date.now();

  afterInit(server: Server) {
    const took = Date.now() - this.createdAt;
    this.logger.log(`Initialized in ${took}ms`);
  }
}
