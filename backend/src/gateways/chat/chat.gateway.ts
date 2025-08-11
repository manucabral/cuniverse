// src/gateways/chat/chat.gateway.ts
import { Logger, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { gatewayConfig } from './chat.gateway.config';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types';
import { WsJwtGuard } from 'src/auth/ws-jwt-guard';

@UseGuards(WsJwtGuard)
@WebSocketGateway(gatewayConfig)
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  afterInit(server: Server) {
    this.logger.log('ChatGateway initialized');
  }

  handleConnection(client: AuthenticatedSocket) {
    const info = client.data?.user;
    this.logger.log(
      `New client connected: ${client.id} - ${info?.sub ?? 'unknown'}`,
    );
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const user = client.data?.user;
    this.logger.log(`Disconnected: ${user?.sub ?? 'unknown'}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: any,
  ) {
    this.logger.debug(`Received message from ${client.id}`);
    const user = client.data.user;
    this.logger.debug(
      `Message from ${user.sub ?? 'user'} - ${JSON.stringify(payload)}`,
    );
  }
}
