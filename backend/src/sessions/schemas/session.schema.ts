import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  jti: string;

  @Prop({ required: true, index: true })
  jtiId: string;

  @Prop()
  ip?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  deviceType?: string;
  @Prop({ type: Date, index: true })
  expiresAt?: Date;

  @Prop({ default: true })
  valid: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL
SessionSchema.index({ jti: 1 }, { unique: true });
SessionSchema.index({ jtiId: 1 });
