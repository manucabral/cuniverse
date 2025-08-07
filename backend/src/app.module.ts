import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './gateways/game/game.gateway';
import { LobbyGateway } from './gateways/lobby/lobby.gateway';
import { ChatGateway } from './gateways/chat/chat.gateway';

@Module({
  imports: [GameGateway, LobbyGateway, ChatGateway],
  controllers: [],
  providers: [],
})
export class AppModule {}
