import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const uri = this.configService.get<string>('database.mongodb.uri');
    this.logger.debug(`Target ${uri}`);
    const state = this.connection.readyState;
    if (state === 1) {
      this.logger.log('Connected successfully');
      return;
    }

    if (state === 2) this.logger.log('Connecting to MongoDB...');
    else this.logger.debug(`State=${state}`);

    this.connection.once('open', () =>
      this.logger.log('Connection established'),
    );
    this.connection.on('connected', () =>
      this.logger.log('Connection established'),
    );
    this.connection.on('error', (err) =>
      this.logger.error(`${err?.message ?? err}`),
    );
    this.connection.on('disconnected', () =>
      this.logger.warn('Disconnected from MongoDB'),
    );
  }

  getConnection(): Connection {
    return this.connection;
  }
}
