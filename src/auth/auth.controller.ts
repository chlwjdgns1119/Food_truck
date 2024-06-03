import { Controller, Res, Get, UseGuards, Req, Post, Session, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register-common.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('common/register')
  commonRegister(
    @Body() body: RegisterDto,
  ){
    const newUser = this.authService.registerUser(body);

    return newUser;
  }

  
/* // 'google 로그인'버튼 클릭시 호출
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
  } */

  /* @Get('/logout')
  logout(@Req() request: Request, @Res() response: Response): void {
    request.session.destroy((err) => {
      if (err) {
        console.error('세션 삭제 중 에러 발생:', err);
        response.status(500).send('세션 삭제 중 에러 발생');
      }
    });
  }

  @Get('common/login')
  async commonLogin(@Req() req){
    if(req.session.user){
      console.log("대충 내비두면 될듯?");
      console.log(req.session);
    }
    else{
      const user = this.userService.findByUserID(req.body.id);
      console.log("user");
      return user;
    }
  }

  @Post('common/register')
  commonRegister(@Body() body: RegisterDto){
    const user = this.userService.createUser(body);
    console.log(user)
    return user;
  } */
  
}