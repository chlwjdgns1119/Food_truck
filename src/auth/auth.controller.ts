import { Controller, Res, Get, UseGuards, Req, Post, Session, Body } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register-common.dto';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Repository } from 'typeorm';
import { UserModel } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('common/register')
  commonRegister(
    @Body() body: RegisterDto,
  ){
    const newUser = this.authService.registerUser(body);

    return newUser;
  }

  @Get('common/login')
  async commonLogin(
    @Body('id') userid: string,
    @Body('password') password: string,
  ){
    const user = this.authService.loginUser(userid, password);
    
    return user;
  }

  @Get('test')
  async test(
    @Body('email') email: string,
  ){
    const user = await this.userRepository.findOneOrFail({where: {email}})
    return user;
  }

  @Get('session')
  getSession(
    @Req() req,
  ){
    return req.user;
  }

  @Get('common/strategy/login')
  @UseGuards(LocalAuthGuard)
  async commonLoginstrategy(
    @Req() req,
    @Body('userid') userid: string,
    @Body('password') password: string,
  ){
    console.log("controller");
    const user = req.user;
    return user;
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