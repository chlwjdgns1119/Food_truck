import { Controller, Res, Get, UseGuards, Req, Post, Session, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UserModel } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggedInGuard } from './guard/logged-in.guard';
import { AuthGuard } from '@nestjs/passport';
import { commonRegisterDto } from './dto/common-register.dto';
import { GoogleLoginInfo } from './dto/google-loginInfo.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(UserModel)
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('common/register')
  commonRegister(
    @Body() body: commonRegisterDto,
  ){
    const newUser = this.authService.registerUser(body);

    return newUser;
  }

  @UseGuards(LocalAuthGuard)
  @Get('common/login')
  async commonLogin(
    @Req() req
  ){
    console.log(req.session.id);

    return req.user;
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

  @UseGuards(LoggedInGuard)
  @Get('hi')
  async hi() {
    return 'hi';
  }

  @Get('google/login') // 구글 로그인으로 이동하는 라우터 메서드
  @UseGuards(AuthGuard('google'))  // 여기에서 가드로 가고 googleStrategy에서 validate호출
  async googleLogin(){
    console.log('GET google/login - googleAuth 실행');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Body() body: GoogleLoginInfo,
    @Res() response: Response
  ){
      const user = await this.authService.googleLoginOrRegister(body);

      console.log(user);
      return response.redirect('/');
    }
  



/*   @Get('test')
  async test(
    @Body('email') email: string,
  ){
    const user = await this.userRepository.findOneOrFail({where: {email}})
    return user;
  } */

/*   @Get('session')
  getSession(
    @Req() req,
  ){
    const data = [req.user, req.session];
    return data;
  } */

/*   @Get('common/strategy/login')
  @UseGuards(LocalAuthGuard)
  async commonLoginstrategy(
    @Req() req,
    @Body('userid') userid: string,
    @Body('password') password: string,
  ){
    console.log("controller");
    const user = req.user;
    return user;
  } */

  
  
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