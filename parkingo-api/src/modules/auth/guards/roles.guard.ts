import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // Si no hay decorador @Roles, se permite el acceso
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // Si el usuario no tiene rol o su rol no está en la lista requerida
    if (!user || !user.roleName || !requiredRoles.includes(user.roleName)) {
        throw new ForbiddenException(`Se requiere uno de los siguientes roles para esta acción: ${requiredRoles.join(', ')}`);
    }
    
    return true;
  }
}
