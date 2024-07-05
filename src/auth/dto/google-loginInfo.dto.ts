import { PickType } from "@nestjs/mapped-types";
import { UserModel } from "src/user/entities/user.entity";

export class GoogleLoginInfo extends PickType(UserModel, ['email', 'name', 'provider']){}