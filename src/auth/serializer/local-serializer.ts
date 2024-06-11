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
      console.log(user);
      //user객체는 무거우니, userId만 뽑아서 세션에 저장한다.
      done(null, user.email);
    }
  
    async deserializeUser(payload: any, done: Function) {
      return await this.userRepository
        .findOneOrFail({
          where: { id: payload },
        })
        .then((user) => {
          console.log('user', user);
          done(null, user);
        })
        .catch((err) => done(err));
    }
  }