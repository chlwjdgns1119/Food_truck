import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { commonRegisterDto } from './dto/common-register.dto';
import { googleLoginInfo } from './dto/google-loginInfo.dto';

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

        user.provider = "common";
        // 통과하면 유저 모델 만들기 진행
        const newUser = await this.userService.createUser(user);

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

      async findUserByEmail(email: string){
        const user = await this.userRepository.findOne({where: {email}});
        
        return user;
      }

      async googleLoginOrRegister(userData: googleLoginInfo): Promise<UserModel>{
        const {email, name, provider} = userData;

        const user = await this.findUserByEmail(email);

        if(user) return user;

        const newUser = await this.userRepository.save({
          email,
          name,
          nickname: name,
          provider,
        });

        return newUser;
      }
}