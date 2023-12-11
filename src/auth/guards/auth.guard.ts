import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtservice: JwtService) {}

  private extractTokenFromHeaders(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtservice.verify(token, {
        secret: `${process.env.JWT_SECRET}`,
      });
      request["user"] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
  async validate(payload: any) {
    const user = {
      id: payload.sub,
      role: payload.role,
    };
    return user;
  }
}
