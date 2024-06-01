import { Controller, Res, Get, UseGuards, Req, Post, Session, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { MemoryStore } from 'express-session';
import { RegisterCommonDto } from './dto/register-common.dto';

const store = new MemoryStore();

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

// 'google 로그인'버튼 클릭시 호출
  @Get('google/login') // 구글 로그인으로 이동하는 라우터 메서드
  @UseGuards(AuthGuard('google'))  // 여기에서 가드로 가고 googleStrategy에서 validate호출
  async googleLogin(){
    console.log('GET google/login - googleAuth 실행');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res){
    if(req.session.user){
      console.log("session을 통한 로그인");
      return res.redirect('/');
    }
    else{
      const user = await this.authService.googleLogin(req);
      req.session.user = user;

      console.log("google_auth를 통한 로그인");
      console.log(req.session.user);
      return res.redirect('/');
    }

    return res.redirect('/');
  }

  @Get('/logout')
  logout(@Req() request: Request, @Res() response: Response): void {
    request.session.destroy((err) => {
      if (err) {
        console.error('세션 삭제 중 에러 발생:', err);
        response.status(500).send('세션 삭제 중 에러 발생');
      }
    });
  }

  @Get('common/login')
  commonLogin(@Req() req){
    if(req.session.user){
      console.log("대충 내비두면 될듯?");
      console.log(req.session);
    }
    else{
      const user = this.authService.findByCommon(req.body.id, req.body.password);
      req.session.user = user;
      console.log("처음 로그인");
      console.log(req.session);
    }
  }

  @Post('common/register')
  commonRegister(@Body() body: RegisterCommonDto){
    const user = this.authService.saveUserCommon(body);
    console.log(user)
    return user;
  }
  
}