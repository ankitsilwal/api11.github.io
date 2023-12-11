import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { UserDto } from "./dto/userdto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authModel: Model<User>,
    private jwtservice: JwtService
  ) {}

  async createuser(userdto: UserDto) {
    const { username, password, role, pnumber } = userdto;
    const hashedpassword = await bcrypt.hash(password, 10);
    const usercreation = await this.authModel.create({
      username,
      password: hashedpassword,
      role,
      pnumber,
    });
    if (!usercreation) {
      throw new BadRequestException(`Please Enter valid Details`);
    }
    return usercreation;
  }

  async findbyusername(username: string) {
    return await this.authModel.findOne({ username });
  }

  async login(username: string, password: string) {
    const usersign = await this.findbyusername(username);
    if (!usersign) {
      throw new UnauthorizedException(`Username not found`);
    }

    const validPassword = await bcrypt.compare(password, usersign.password);
    if (!validPassword) {
      throw new UnauthorizedException(`Password does not matched`);
    }

    const payload = {
      sub: usersign.id,
      role: usersign.role,
    };

    const accessToken = this.jwtservice.sign(payload, {
      secret: `${process.env.JWT_SECRET}`,
    });
    return { accessToken };
  }
}
