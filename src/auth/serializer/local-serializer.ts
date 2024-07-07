/* import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import {
  UserRepositoryOutboundPort,
  USER_REPOSITORY_OUTBOUND_PORT,
} from 'src/outbound-ports/user/user-repository.outbound-port';
import { UserRepository } from 'src/repositories/user.repository.ts';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  serializeUser(user: any, done: Function) {
    console.log(user);
    //user객체는 무거우니, userId만 뽑아서 세션에 저장한다.
    done(null, user.id);
  }

  async deserializeUser(payload: any, done: Function) {
    return await this.userRepository
      .findOneOrFail({
        where: { id: params.userId },
      })
      .then((user) => {
        console.log('user', user);
        done(null, user);
      })
      .catch((err) => done(err));
  }
} */

import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
  
  @Injectable()
  export class LocalSerializer extends PassportSerializer {
    constructor(
      @InjectRepository(UserModel)
      private readonly userRepository: Repository<UserModel>,
    ) {
      super();
    }
  
    serializeUser(user: any, done: Function) {
      //user객체는 무거우니, userId만 뽑아서 세션에 저장한다. session store에는 userId만 저장되는 것.
      console.log(user);
      done(null, user.email);
    }
  
    // deserialize는 요청이 들어왔을 때 req의 cookie에서 session 정보를 뽑아서 req 객체에 다시 user 정보 찾아서 붙여준다.
    async deserializeUser(email: string, done: Function) {
      return await this.userRepository
        .findOneOrFail({
          where: { email},
        })
        .then((user) => {
          console.log('되는거임?', user); 
          done(null, user); // 여기서 반환하는 user가 req.user에 정보를 담아준다.
        })
        .catch((err) => done(err));
    }
  }