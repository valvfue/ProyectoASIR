import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwtSecretKey',
    });
  }

  async validate(payload: any): Promise<User | null> {
    if (!payload.sub || typeof payload.sub !== 'number') {
      return null;
    }
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      return null;
    }
    return user;
  }
}

