import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  /** Crea y guarda una sessão; normaliza expiresAt si viene */
  async createSession(dto: CreateSessionDto): Promise<SessionDocument> {
    const toSave: Partial<Session> & { userId: Types.ObjectId } = {
      userId: new Types.ObjectId(dto.userId),
      jti: dto.jti,
      jtiId: dto.jtiId,
      ip: dto.ip,
      valid: true,
    };

    if (dto.expiresAt) {
      const d = new Date(dto.expiresAt);
      if (!isNaN(d.getTime())) toSave.expiresAt = d;
    }

    try {
      const created = await this.sessionModel.create(toSave);
      this.logger.verbose(
        `Session created user=${dto.userId} jtiId=${dto.jtiId}`,
      );
      return created;
    } catch (err) {
      this.logger.error(
        `Failed to create session user=${dto.userId} jtiId=${dto.jtiId}`,
        (err as any)?.stack ?? (err as any)?.message,
      );
      throw new InternalServerErrorException('Could not create session');
    }
  }

  /** Busca sesión por jti */
  async findByJti(jti: string): Promise<SessionDocument | null> {
    return this.sessionModel.findOne({ jti }).exec();
  }

  /** Revoca (marca valid = false) la sesión identificada por jti */
  async revokeSession(jti: string): Promise<boolean> {
    try {
      const res = await this.sessionModel
        .findOneAndUpdate({ jti, valid: true }, { valid: false })
        .exec();
      if (res) this.logger.verbose(`Revoked session jti=${jti}`);
      return !!res;
    } catch (err) {
      this.logger.error(`Error revoking session jti=${jti}`, err as any);
      throw new InternalServerErrorException('Could not revoke session');
    }
  }

  /** Revoca todas las sesiones activas de un usuario */
  async revokeAllForUser(userId: string): Promise<number> {
    try {
      const result = await this.sessionModel
        .updateMany(
          { userId: new Types.ObjectId(userId), valid: true },
          { valid: false },
        )
        .exec();
      const count =
        (result as any).modifiedCount ?? (result as any).nModified ?? 0;
      this.logger.verbose(`Revoked ${count} sessions for user=${userId}`);
      return count;
    } catch (err) {
      this.logger.error(
        `Error revoking sessions for user=${userId}`,
        err as any,
      );
      throw new InternalServerErrorException(
        'Could not revoke sessions for user',
      );
    }
  }

  /** Comprueba si una sesión es válida y no está expirada */
  async isValidSession(jti: string): Promise<boolean> {
    const s = await this.sessionModel
      .findOne({ jti, valid: true })
      .select('expiresAt')
      .lean()
      .exec();
    if (!s) return false;
    if (s.expiresAt && new Date(s.expiresAt).getTime() <= Date.now())
      return false;
    return true;
  }

  /** Lista sesiones de un usuario (paginación simple) */
  async listForUser(userId: string, limit = 20, skip = 0) {
    const query = { userId: new Types.ObjectId(userId) } as any;
    const items = await this.sessionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(Math.max(1, Math.min(100, limit)))
      .skip(Math.max(0, skip))
      .lean()
      .exec();
    const total = await this.sessionModel.countDocuments(query).exec();
    return { items, total, limit, skip };
  }
}
