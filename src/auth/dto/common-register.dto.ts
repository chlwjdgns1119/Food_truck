import { PickType } from "@nestjs/mapped-types";
import { UserModel } from "src/user/entities/user.entity";

export class commonRegisterDto extends PickType(UserModel, ['userid', 'email', 'nickname', 'password', 'address', 'tel', 'isAdmin', 'provider']){}
