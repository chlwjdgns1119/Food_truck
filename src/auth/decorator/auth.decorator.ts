import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
        
      const user = request.user;
      
      if(!user){
        throw new InternalServerErrorException("request에 user 프로퍼티가 존재하지 않습니다.");
      }

      return user;
    },
  );