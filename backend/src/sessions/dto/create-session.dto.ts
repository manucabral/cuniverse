import { IsString, IsOptional, IsISO8601 } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  userId: string;

  @IsString()
  jti: string;

  @IsString()
  jtiId: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  deviceType?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;
}
