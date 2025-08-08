import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: 0 })
  played: number;

  @Prop({ default: 0 })
  wins: number;

  @Prop({ default: 0 })
  losses: number;

  @Prop({ select: false, default: null })
  refreshTokenJti?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
