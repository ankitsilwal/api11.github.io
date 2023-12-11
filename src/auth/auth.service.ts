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


  async loginn(username: string, password: string, pnumber: number) {
    const user = await this.findUserByUsernameOrPnumber(username, pnumber);
    if (!user) {
      throw new UnauthorizedException(`User not found`);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException(`Password does not match`);
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtservice.sign(payload, {
      secret: `${process.env.JWT_SECRET}`,
    });

    return { accessToken };
  }

  private async findUserByUsernameOrPnumber(username: string, pnumber: number) {
    return await this.authModel.findOne({
      $or: [{ username: username }, { pnumber: pnumber }],
    });
  }
}
