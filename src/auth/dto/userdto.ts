import { IsEnum } from "class-validator";
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  VIEWER = "viewer",
}

export class UserDto {
  username: string;

  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  pnumber: string;
}
