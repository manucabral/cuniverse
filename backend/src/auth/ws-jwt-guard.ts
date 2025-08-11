import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const secret = this.configService.get<string>(
      'security.tokens.access.secret',
    );
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }
    this.jwtSecret = secret;
  }

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.headers?.auth || '';
    this.logger.log(`Checking client ${client.id} for token`);
    if (!token) {
      this.logger.warn(`Guard: No token provided for client ${client.id}`);
      throw new WsException('Unauthorized: No token provided');
    }
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.jwtSecret,
      });
      client.data = client.data || {};
      client.data.user = payload;
      this.logger.debug(`Identified ${payload.email} for client ${client.id}`);
      return true;
    } catch (error) {
      this.logger.warn(`Guard: token verification failed - ${error.message}`);
      throw new WsException('Unauthorized: Invalid token');
    }
  }
}
