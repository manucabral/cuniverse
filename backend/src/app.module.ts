import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './gateways/game/game.gateway';

@Module({
  imports: [GameGateway],
  controllers: [],
  providers: [],
})
export class AppModule {}
