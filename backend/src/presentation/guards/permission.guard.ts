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

    console.log(
      "🔐 PermissionGuard - Required permissions:",
      requiredPermissions
    );

    if (!requiredPermissions) {
      console.log(
        "🔐 PermissionGuard - No permissions required, allowing access"
      );
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    console.log("🔐 PermissionGuard - User:", user);

    if (!user) {
      console.log("🔐 PermissionGuard - No user found, denying access");
      return false;
    }

    // Check if user has required permissions
    const hasPermission = this.hasPermission(user, requiredPermissions);
    console.log("🔐 PermissionGuard - Has permission:", hasPermission);
    return hasPermission;
  }

  private hasPermission(user: any, requiredPermissions: string[]): boolean {
    console.log("🔐 PermissionGuard - User roles:", user.roles);

    if (!user.roles || !Array.isArray(user.roles)) {
      console.log("🔐 PermissionGuard - No roles found");
      return false;
    }

    const userPermissions = new Set<string>();

    // Collect all permissions from user's roles
    user.roles.forEach((role) => {
      console.log(
        "🔐 PermissionGuard - Role:",
        role.name,
        "Permissions:",
        role.permissions
      );
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach((permission) => {
          userPermissions.add(permission.name);
        });
      }
    });

    console.log(
      "🔐 PermissionGuard - User permissions:",
      Array.from(userPermissions)
    );

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.has(permission)
    );

    console.log(
      "🔐 PermissionGuard - Has all required permissions:",
      hasAllPermissions
    );
    return hasAllPermissions;
  }
}
