import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { commonRegisterDto } from './dto/common-register.dto';
import { GoogleLoginInfo } from './dto/google-loginInfo.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}
      // 회원가입
      async registerUser(user: commonRegisterDto){

        // 이미 사용 중인 아이디, 이메일, 닉네임 확인
        const useridExists = await this.userRepository.exists({where: {userid: user.userid}});
        if(useridExists){
            throw new UnauthorizedException('이미 사용 중인 아이디입니다.');
        }

        const emailExists = await this.userRepository.exists({where: {email: user.email}});
        if(emailExists){
            throw new UnauthorizedException('이미 사용 중인 이메일입니다.');
        }

        const nicknameExsists = await this.userRepository.exists({where: {nickname: user.nickname}});
        if(nicknameExsists){
            throw new UnauthorizedException('이미 사용 중인 닉네임입니다.');
        }

        const hashPassword = await bcrypt.hash(
          user.password,
          parseInt(this.configService.get<string>('HASH_ROUNDS'))
        )
        user.password = hashPassword;
        // 통과하면 유저 모델 만들기 진행
        const newUser = this.userService.createUser(user);

        return newUser;

      }

      async loginUser(userid: string, password: string){
        const user = await this.userService.findByUserID(userid);

        if(!user){
          throw new UnauthorizedException('존재하지 않는 아이디입니다.');
        }

        const pass = await bcrypt.compare(password, user.password);

        if(!pass){
          throw new UnauthorizedException('비밀번호가 틀렸습니다');
        }

        return user;        
      }

      async googleLoginOrRegister(userData: GoogleLoginInfo): Promise<UserModel> {
        const { email, name, provider } = userData;

        const user = this.findByEmailOrSave(email, name, provider);

        return user;
      }

      async findByEmailOrSave(email: string, fullName: string, provider: string): Promise<UserModel> {
        try {
          const foundUser = await this.userRepository.findOne({ where: { email } });
          if (foundUser) return foundUser;
    
          const newUser = this.userRepository.save({
            email,
            name: fullName,
            nickname: fullName,
            provider,
          });
          return newUser;
        } catch (error) {
          throw new Error('사용자를 찾거나 생성하는데 실패하였습니다');
        }
      }
    
/*   async findByEmailOrSave(email: string, fullName: string, provider: string): Promise<UserModel> {
    try {
      const foundUser = await this.userRepository.findOne({ where: { email } });
      if (foundUser) return foundUser;

      const newUser = this.userRepository.save({
        email,
        name: fullName,
        nickname: fullName,
        provider,
      });
      return newUser;
    } catch (error) {
      throw new Error('사용자를 찾거나 생성하는데 실패하였습니다');
    }
  }

  async googleLogin(req): Promise<any> {
    const { email, firstName, lastName, provider } = req.user;

    const fullName = firstName + lastName;
    const user: UserModel = await this.findByEmailOrSave(email, fullName, provider); // 이메일로 가입된 회원을 찾고, 없다면 회원가입

    // JWT 토큰에 포함될 payload
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      name: user.name,
      isAdmin: user.isAdmin,
    };

    return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME, secret: process.env.ACCESS_SECRET_KEY }) };
  } */
}