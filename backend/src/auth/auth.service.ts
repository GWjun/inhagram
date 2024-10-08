import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersModel } from 'src/users/entity/users.entity';

import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  signToken(
    user: Pick<UsersModel, 'nickname' | 'email' | 'id'>,
    isRefreshToken: boolean,
  ) {
    const payload = {
      name: user.nickname,
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: isRefreshToken
        ? parseInt(process.env['REFRESH_EXPIRE'])
        : parseInt(process.env['ACCESS_EXPIRE']),
    });
  }

  getToken(user: Pick<UsersModel, 'nickname' | 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticate(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.userService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('User does not exist.');
    }

    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('Invalid password.');
    }

    return existingUser;
  }

  async login(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticate(user);

    return this.getToken(existingUser);
  }

  async register(user: RegisterUserDto) {
    const hashValue = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get('HASH_ROUNDS')),
    );

    const newUser = await this.userService.createUser({
      ...user,
      password: hashValue,
    });

    return this.getToken(newUser);
  }

  extractToken(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = splitToken[1];
    return token;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
    const splitToken = decoded.split(':');

    if (splitToken.length !== 2) {
      throw new UnauthorizedException('Invalid token');
    }

    const email = splitToken[0];
    const password = splitToken[1];

    return { email, password };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException('Token is expired or invalid');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Only require refresh token');
    }

    return this.signToken({ ...decoded }, isRefreshToken);
  }
}
