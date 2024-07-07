import { Controller, Res, Get, UseGuards, Req, Post, Session, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LoggedInGuard } from './guard/logged-in.guard';
import { commonRegisterDto } from './dto/common-register.dto';
import { User } from './decorator/auth.decorator';
import { GoogleAuthGuard } from './guard/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('common/login')
  commonLogin(
    @User() user,
    @Session() session,
  ){
    console.log(session.id);
    console.log(session);
    return user;
  }

  @Post('common/register')
  async commonRegister(
    @Body() body: commonRegisterDto,
  ){
    const newUser = await this.authService.registerUser(body);
    return newUser;
  }

  @UseGuards(LoggedInGuard)
  @Get('user/session')
  async hi(
    @User() user,
  ){
    return user;
  }

  @UseGuards(GoogleAuthGuard)  // 여기에서 가드로 가고 googleStrategy에서 validate호출
  @Get('google/login') // 구글 로그인으로 이동하는 라우터 메서드
  async googleLogin(){}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @User() user,
    @Session() session,
  ){
    console.log(session.id);
    console.log(session);
    return user;
  }

  @Get('/logout')
  logout(
    @Req() req: Request,
    @Res() response: Response
  ): void {
    req.session.destroy((err) => {
      if (err) {
        console.error('세션 삭제 중 에러 발생:', err);
        response.status(500).send('세션 삭제 중 에러 발생');
      }
    });
  }



}