import { DataSource } from "typeorm";
import { Role } from "../entities/role.entity";
import { Permission } from "../entities/permission.entity";

export class RolePermissionSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const roleRepository = this.dataSource.getRepository(Role);
    const permissionRepository = this.dataSource.getRepository(Permission);

    // Create permissions
    const permissions = await this.createPermissions(permissionRepository);

    // Create roles
    await this.createRoles(roleRepository, permissions);
  }

  private async createPermissions(permissionRepository: any) {
    const permissions = [
      // User management
      {
        name: "user:read",
        description: "Read user information",
        resource: "user",
        action: "read",
      },
      {
        name: "user:create",
        description: "Create new users",
        resource: "user",
        action: "create",
      },
      {
        name: "user:update",
        description: "Update user information",
        resource: "user",
        action: "update",
      },
      {
        name: "user:delete",
        description: "Delete users",
        resource: "user",
        action: "delete",
      },
      {
        name: "user:manage",
        description: "Manage all users",
        resource: "user",
        action: "manage",
      },

      // Review management
      {
        name: "review:read",
        description: "Read reviews",
        resource: "review",
        action: "read",
      },
      {
        name: "review:create",
        description: "Create reviews",
        resource: "review",
        action: "create",
      },
      {
        name: "review:update",
        description: "Update own reviews",
        resource: "review",
        action: "update",
      },
      {
        name: "review:delete",
        description: "Delete own reviews",
        resource: "review",
        action: "delete",
      },
      {
        name: "review:moderate",
        description: "Moderate all reviews",
        resource: "review",
        action: "moderate",
      },

      // University management
      {
        name: "university:read",
        description: "Read university information",
        resource: "university",
        action: "read",
      },
      {
        name: "university:create",
        description: "Create universities",
        resource: "university",
        action: "create",
      },
      {
        name: "university:update",
        description: "Update university information",
        resource: "university",
        action: "update",
      },
      {
        name: "university:delete",
        description: "Delete universities",
        resource: "university",
        action: "delete",
      },
      {
        name: "university:manage",
        description: "Manage all universities",
        resource: "university",
        action: "manage",
      },

      // Blog management
      {
        name: "blog:read",
        description: "Read blog posts",
        resource: "blog",
        action: "read",
      },
      {
        name: "blog:create",
        description: "Create blog posts",
        resource: "blog",
        action: "create",
      },
      {
        name: "blog:update",
        description: "Update own blog posts",
        resource: "blog",
        action: "update",
      },
      {
        name: "blog:delete",
        description: "Delete own blog posts",
        resource: "blog",
        action: "delete",
      },
      {
        name: "blog:moderate",
        description: "Moderate all blog posts",
        resource: "blog",
        action: "moderate",
      },
      {
        name: "blog:publish",
        description: "Publish blog posts for moderation",
        resource: "blog",
        action: "publish",
      },
      {
        name: "blog:like",
        description: "Like/unlike blog posts",
        resource: "blog",
        action: "like",
      },

      // Tag management
      {
        name: "tag:read",
        description: "Read tags",
        resource: "tag",
        action: "read",
      },
      {
        name: "tag:create",
        description: "Create tags",
        resource: "tag",
        action: "create",
      },
      {
        name: "tag:update",
        description: "Update tags",
        resource: "tag",
        action: "update",
      },
      {
        name: "tag:delete",
        description: "Delete tags",
        resource: "tag",
        action: "delete",
      },
      {
        name: "tag:manage",
        description: "Manage all tags",
        resource: "tag",
        action: "manage",
      },

      // System management
      {
        name: "system:read",
        description: "Read system information",
        resource: "system",
        action: "read",
      },
      {
        name: "system:manage",
        description: "Manage system settings",
        resource: "system",
        action: "manage",
      },
      {
        name: "system:admin",
        description: "Full system administration",
        resource: "system",
        action: "admin",
      },

      // Role and permission management
      {
        name: "role:read",
        description: "Read roles",
        resource: "role",
        action: "read",
      },
      {
        name: "role:create",
        description: "Create roles",
        resource: "role",
        action: "create",
      },
      {
        name: "role:update",
        description: "Update roles",
        resource: "role",
        action: "update",
      },
      {
        name: "role:delete",
        description: "Delete roles",
        resource: "role",
        action: "delete",
      },
      {
        name: "role:manage",
        description: "Manage all roles",
        resource: "role",
        action: "manage",
      },

      // Permission management
      {
        name: "permission:read",
        description: "Read permissions",
        resource: "permission",
        action: "read",
      },
      {
        name: "permission:create",
        description: "Create permissions",
        resource: "permission",
        action: "create",
      },
      {
        name: "permission:update",
        description: "Update permissions",
        resource: "permission",
        action: "update",
      },
      {
        name: "permission:delete",
        description: "Delete permissions",
        resource: "permission",
        action: "delete",
      },
      {
        name: "permission:manage",
        description: "Manage all permissions",
        resource: "permission",
        action: "manage",
      },

      // Upload management
      {
        name: "upload:read",
        description: "Read uploaded files",
        resource: "upload",
        action: "read",
      },
      {
        name: "upload:create",
        description: "Upload images",
        resource: "upload",
        action: "create",
      },
      {
        name: "upload:update",
        description: "Update images",
        resource: "upload",
        action: "update",
      },
      {
        name: "upload:delete",
        description: "Delete images",
        resource: "upload",
        action: "delete",
      },
      {
        name: "upload:manage",
        description: "Manage all uploads",
        resource: "upload",
        action: "manage",
      },
    ];

    const createdPermissions = [];
    for (const permissionData of permissions) {
      let permission = await permissionRepository.findOne({
        where: { name: permissionData.name },
      });
      if (!permission) {
        permission = permissionRepository.create(permissionData);
        await permissionRepository.save(permission);
      }
      createdPermissions.push(permission);
    }

    return createdPermissions;
  }

  private async createRoles(roleRepository: any, permissions: Permission[]) {
    const roles = [
      {
        name: "super_admin",
        description: "Super Administrator with full system access",
        isSystem: true,
        permissions: permissions.map((p) => p.name), // All permissions
      },
      {
        name: "admin",
        description: "Administrator with system management access",
        isSystem: true,
        permissions: [
          "user:read",
          "user:create",
          "user:update",
          "user:delete",
          "review:read",
          "review:moderate",
          "university:read",
          "university:create",
          "university:update",
          "university:delete",
          "blog:read",
          "blog:moderate",
          "blog:publish",
          "blog:like",
          "tag:read",
          "tag:create",
          "tag:update",
          "tag:delete",
          "tag:manage",
          "system:read",
          "system:manage",
          "role:read",
          "role:create",
          "role:update",
          "role:delete",
          "permission:read",
          "permission:create",
          "permission:update",
          "permission:delete",
          "upload:read",
          "upload:create",
          "upload:update",
          "upload:delete",
          "upload:manage",
        ],
      },
      {
        name: "moderator",
        description: "Content moderator",
        isSystem: true,
        permissions: [
          "user:read",
          "review:read",
          "review:moderate",
          "blog:read",
          "blog:moderate",
          "tag:read",
          "upload:read",
          "upload:create",
          "upload:update",
          "upload:delete",
        ],
      },
      {
        name: "university_representative",
        description: "University representative",
        isSystem: true,
        permissions: [
          "user:read",
          "review:read",
          "university:read",
          "university:update",
          "blog:read",
          "blog:create",
          "blog:update",
          "blog:delete",
          "blog:publish",
          "blog:like",
          "tag:read",
          "upload:read",
          "upload:create",
          "upload:update",
          "upload:delete",
        ],
      },
      {
        name: "student",
        description: "Regular student user",
        isSystem: true,
        permissions: [
          "user:read",
          "user:update",
          "review:read",
          "review:create",
          "review:update",
          "review:delete",
          "university:read",
          "blog:read",
          "blog:create",
          "blog:update",
          "blog:delete",
          "blog:publish",
          "blog:like",
          "tag:read",
          "upload:read",
          "upload:create",
          "upload:update",
          "upload:delete",
        ],
      },
      {
        name: "guest",
        description: "Guest user with limited access",
        isSystem: true,
        permissions: ["review:read", "university:read", "blog:read"],
      },
    ];

    for (const roleData of roles) {
      let role = await roleRepository.findOne({
        where: { name: roleData.name },
      });
      if (!role) {
        role = roleRepository.create({
          name: roleData.name,
          description: roleData.description,
          isSystem: roleData.isSystem,
        });
        await roleRepository.save(role);
      }

      // Always assign/update permissions to role (for both new and existing roles)
      const rolePermissions = permissions.filter((p) =>
        roleData.permissions.includes(p.name)
      );
      role.permissions = rolePermissions;
      await roleRepository.save(role);
    }
  }
}
