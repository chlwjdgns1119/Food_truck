import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register-common.dto';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
    private userService: UserService,
    private configService: ConfigService,
  ) {}
      // 회원가입
      async registerUser(user: RegisterDto): Promise<UserModel> {

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
          user.password, process.env.HASH_ROUNDS
        )
        user.password
        // 통과하면 유저 모델 만들기 진행
        const newUser = this.userService.createUser(user);

        return newUser;

      }

      loginUser(userid: string, password: string){

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