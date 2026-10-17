import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoleRepository } from '../../roles/repositories/role.repository.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      configService: ConfigService,
      private readonly roleRepository: RoleRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    const role = await this.roleRepository.findById(payload.roleId);
    if (!role) throw new UnauthorizedException('Rol inválido asignado al usuario.');

    return { 
        userId: payload.sub, 
        email: payload.email, 
        roleId: payload.roleId, 
        roleName: role.name 
    };
  }
}
