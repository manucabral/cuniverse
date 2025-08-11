import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatWebsocketsModule } from './gateways/chat/chat.module';
// import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ChatWebsocketsModule,
    // SessionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
