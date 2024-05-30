import { PickType } from "@nestjs/mapped-types";
import { UserModel } from "src/user/entities/user.entity";

export class RegisterCommonDto extends PickType(UserModel, ['userid', 'email', 'name', 'nickname', 'password', 'address', 'tel']){}
