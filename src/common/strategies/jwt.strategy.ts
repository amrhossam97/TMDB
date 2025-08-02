import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Decription } from "@root/common/encription/decription";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserInterface } from "../interfaces/user.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET_KEY}`,
    });
  }

  async validate(payload: any) {
    try {
      //#decrept
      const iv = process.env.ENCRIPT_IV;
      const password = process.env.ENCRIPT_KEY;
      let user: UserInterface = {
        userId: +Decription(payload.userId, password, iv),
        userName: Decription(payload.userName, password, iv),
        userPhone: Decription(payload.userPhone, password, iv),
      };
      return user;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
