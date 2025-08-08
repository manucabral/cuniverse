import { Model } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/register-auth.dto';
import { Logger } from '@nestjs/common';
import { UserDocument } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

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
    return {
      message: 'Registered successfully',
      data: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  }
}
