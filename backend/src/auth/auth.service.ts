import { Model } from 'mongoose';
import {
  ConflictException,
  UnauthorizedException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
// import { SessionsService } from 'src/sessions/sessions.service';
import { CreateSessionDto } from 'src/sessions/dto/create-session.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // private readonly sessionsService: SessionsService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    this.logger.log(`Registering user with email: ${registerDto.email}`);
    const existingUser = await this.userModel.findOne({
      $or: [{ email: registerDto.email }, { name: registerDto.name }],
    });
    if (existingUser) {
      this.logger.warn(`User already exists with email: ${registerDto.email}`);
      throw new ConflictException('Name or email already exists');
    }

    const encryptedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = new this.userModel({
      ...registerDto,
      password: encryptedPassword,
    });
    await newUser.save();

    return { message: 'Registered successfully' };
  }

  private async generateTokens(userId: string, email: string) {
    const jti = uuidv4();
    const jtiId = jti.slice(0, 8);

    const accessExp =
      this.configService.get<string>('security.tokens.access.expiration') ||
      '15m';
    const refreshExp =
      this.configService.get<string>('security.tokens.refresh.expiration') ||
      '7d';

    const access_token = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('security.tokens.access.secret'),
        expiresIn: accessExp,
      },
    );

    const refresh_token = await this.jwtService.signAsync(
      { sub: userId, email, jti, jtiId },
      {
        secret: this.configService.get<string>(
          'security.tokens.refresh.secret',
        ),
        expiresIn: refreshExp,
      },
    );

    return { access_token, refresh_token, jti, jtiId, accessExp, refreshExp };
  }

  async login({ email, password }: LoginDto, options?: { ip?: string }) {
    this.logger.log(
      `Login attempt for ${email} from IP=${options?.ip ?? 'unknown'}`,
    );

    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      this.logger.warn(`Failed login: user not found ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      this.logger.warn(`Failed login: invalid password for ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id.toString(), user.email);

    /*
    let expiresAtIso: string | undefined;
    try {
      const decoded = this.jwtService.decode(tokens.refresh_token) as {
        exp?: number;
      } | null;
      if (decoded?.exp && typeof decoded.exp === 'number') {
        expiresAtIso = new Date(decoded.exp * 1000).toISOString();
      } else {
        this.logger.debug(
          'refresh_token decodificado sin claim exp; no se seteará expiresAt',
        );
      }
    } catch (err) {
      this.logger.debug(
        'No se pudo decodificar refresh_token para expiresAt',
        err,
      );
    }


    try {
      const createDto: CreateSessionDto = {
        userId: user.id.toString(),
        jti: tokens.jti,
        jtiId: tokens.jtiId,
        ip: options?.ip,
        expiresAt: expiresAtIso,
      };
      await this.sessionsService.createSession(createDto);
    } catch (err) {
      this.logger.error('Failed to create session record', err as any);
    }
    */

    return {
      message: 'Successfully logged in',
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }
}
