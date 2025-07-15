import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      "permissions",
      context.getHandler()
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // Check if user has required permissions
    return this.hasPermission(user, requiredPermissions);
  }

  private hasPermission(user: any, requiredPermissions: string[]): boolean {
    if (!user.roles || !Array.isArray(user.roles)) {
      return false;
    }

    const userPermissions = new Set<string>();

    // Collect all permissions from user's roles
    user.roles.forEach((role) => {
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach((permission) => {
          userPermissions.add(permission.name);
        });
      }
    });

    // Check if user has all required permissions
    return requiredPermissions.every((permission) =>
      userPermissions.has(permission)
    );
  }
}
