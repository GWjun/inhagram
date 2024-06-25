import { Body, Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLogin(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractToken(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.login(credentials);
  }

  @Post('register/email')
  postRegister(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password', new MaxLengthPipe(20), new MinLengthPipe(4))
    password: string,
  ) {
    return this.authService.register({
      nickname,
      email,
      password,
    });
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractToken(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);

    return { accessToken: newToken };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractToken(rawToken, true);
    const newToken = this.authService.rotateToken(token, true);

    return { refreshToken: newToken };
  }
}
