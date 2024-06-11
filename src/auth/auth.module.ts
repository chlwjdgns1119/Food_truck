import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { AppModule } from 'src/app.module';
import { UserModel } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalSerializer } from './serializer/local-serializer';

@Module({
  imports: [
  TypeOrmModule.forFeature([UserModel]),
  JwtModule, 
  UserModule,
  PassportModule.register({
    session: true,
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
