import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register-common.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserModel)
        private readonly userRepository : Repository<UserModel>,
    ){}

    // commonlogin에서 사용할 예정. userid로만 user 정보 찾기. 있으면 entity 반환 없으면 null 반환.
    async findByUserID(userid: string) : Promise<UserModel> {
        const user = await this.userRepository.findOne({where: {userid}});

        return user;
    }

    // user 만들기
    async createUser(user: RegisterDto): Promise<UserModel> {
        const userObject = this.userRepository.create(user);

        const newUser = await this.userRepository.save(userObject);
        
        return newUser;
    }

    // 로그인
}
