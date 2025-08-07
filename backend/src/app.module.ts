import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { GameGateway } from './gateways/game/game.gateway';
import { LobbyGateway } from './gateways/lobby/lobby.gateway';
import { ChatGateway } from './gateways/chat/chat.gateway';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    GameGateway,
    LobbyGateway,
    ChatGateway,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
