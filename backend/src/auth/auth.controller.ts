import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  postLogin(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractToken(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.login(credentials);
  }

  @Post('register/email')
  postRegister(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register({
      nickname,
      email,
      password,
    });
  }

  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractToken(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);

    return { accessToken: newToken };
  }

  @Post('token/refresh')
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractToken(rawToken, true);
    const newToken = this.authService.rotateToken(token, true);

    return { refreshToken: newToken };
  }
}
