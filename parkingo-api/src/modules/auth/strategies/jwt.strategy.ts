import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoleRepository } from '../../roles/repositories/role.repository.js';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository.js';

interface JwtPayload {
  sub: string;
  email: string;
  roleId: string;
  roleName?: string;
}

interface CachedAuthContext {
  roleName: string;
  status: string;
  expiresAt: number;
}

const AUTH_CACHE_TTL_MS = 15_000;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly authCache = new Map<string, CachedAuthContext>();

  constructor(
      configService: ConfigService,
      private readonly roleRepository: RoleRepository,
      private readonly usuarioRepository: UsuarioRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    const cacheKey = `${payload.sub}:${payload.roleId}`;
    const now = Date.now();
    const cached = this.authCache.get(cacheKey);

    let roleName = cached && cached.expiresAt > now ? cached.roleName : undefined;
    let userStatus = cached && cached.expiresAt > now ? cached.status : undefined;

    if (!roleName || !userStatus) {
      try {
        const user = await this.usuarioRepository.findById(payload.sub);
        userStatus = user.status;
        roleName = user.role?.name || payload.roleName;
      } catch {
        throw new UnauthorizedException('El usuario de la sesión ya no existe.');
      }

      if (!roleName) {
        const role = await this.roleRepository.findById(payload.roleId);
        if (!role) throw new UnauthorizedException('Rol inválido asignado al usuario.');
        roleName = role.name;
      }

      this.authCache.set(cacheKey, {
        roleName,
        status: userStatus,
        expiresAt: now + AUTH_CACHE_TTL_MS,
      });
    }

    if (userStatus === 'SUSPENDED' || userStatus === 'INACTIVE' || userStatus === 'DELETED') {
      throw new UnauthorizedException('La cuenta del usuario se encuentra inactiva o suspendida.');
    }

    return { 
        id: payload.sub,
        userId: payload.sub, 
        email: payload.email, 
        roleId: payload.roleId, 
        roleName,
        role: roleName,
    };
  }
}

