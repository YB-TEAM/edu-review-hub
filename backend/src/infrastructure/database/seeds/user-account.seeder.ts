import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { UserRole } from "../entities/user-role.entity";
import * as bcrypt from "bcryptjs";

export class UserAccountSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const userRepository = this.dataSource.getRepository(User);
    const roleRepository = this.dataSource.getRepository(Role);
    const userRoleRepository = this.dataSource.getRepository(UserRole);

    // Check if super admin already exists
    const existingSuperAdmin = await userRepository.findOne({
      where: { username: "superadmin" },
    });

    if (existingSuperAdmin) {
      console.log("⚠️ Super admin account already exists, skipping...");
    } else {
      // Create super admin account
      await this.createSuperAdmin(
        userRepository,
        roleRepository,
        userRoleRepository
      );
    }

    // Create test accounts for each role
    await this.createTestAccounts(
      userRepository,
      roleRepository,
      userRoleRepository
    );
  }

  private async createSuperAdmin(
    userRepository: any,
    roleRepository: any,
    userRoleRepository: any
  ) {
    console.log("👑 Creating super admin account...");

    // Hash password
    const hashedPassword = await bcrypt.hash("superadmin123", 10);

    // Create super admin user
    const superAdmin = userRepository.create({
      username: "superadmin",
      email: "superadmin@edu-review-hub.com",
      passwordHash: hashedPassword,
      status: "active",
      accountType: "super_admin",
      isVerified: true,
      emailVerifiedAt: new Date(),
      failedLoginAttempts: 0,
    });

    await userRepository.save(superAdmin);

    // Get super_admin role
    const superAdminRole = await roleRepository.findOne({
      where: { name: "super_admin" },
    });

    if (superAdminRole) {
      // Assign super_admin role
      const userRole = userRoleRepository.create({
        user_id: superAdmin.id,
        role_id: superAdminRole.id,
      });

      await userRoleRepository.save(userRole);
      console.log("✅ Super admin account created successfully!");
      console.log("   Username: superadmin");
      console.log("   Password: superadmin123");
    }
  }

  private async createTestAccounts(
    userRepository: any,
    roleRepository: any,
    userRoleRepository: any
  ) {
    const testAccounts = [
      {
        username: "admin_test",
        email: "admin@test.com",
        password: "admin123",
        roleName: "admin",
        accountType: "admin",
      },
      {
        username: "moderator_test",
        email: "moderator@test.com",
        password: "moderator123",
        roleName: "moderator",
        accountType: "moderator",
      },
      {
        username: "university_rep_test",
        email: "university@test.com",
        password: "university123",
        roleName: "university_representative",
        accountType: "university_rep",
      },
      {
        username: "student_test",
        email: "student@test.com",
        password: "student123",
        roleName: "student",
        accountType: "student",
      },
      // Guest account removed as it's not in UserRole enum
    ];

    console.log("👥 Creating test accounts for each role...");

    for (const accountData of testAccounts) {
      // Check if account already exists
      const existingUser = await userRepository.findOne({
        where: { username: accountData.username },
      });

      if (existingUser) {
        console.log(
          `⚠️ Account ${accountData.username} already exists, skipping...`
        );
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(accountData.password, 10);

      // Create user
      const user = userRepository.create({
        username: accountData.username,
        email: accountData.email,
        passwordHash: hashedPassword,
        status: "active",
        accountType: accountData.accountType,
        isVerified: true,
        emailVerifiedAt: new Date(),
        failedLoginAttempts: 0,
      });

      await userRepository.save(user);

      // Get role
      const role = await roleRepository.findOne({
        where: { name: accountData.roleName },
      });

      if (role) {
        // Assign role
        const userRole = userRoleRepository.create({
          user_id: user.id,
          role_id: role.id,
        });

        await userRoleRepository.save(userRole);
        console.log(
          `✅ Created ${accountData.roleName} account: ${accountData.username}`
        );
      }
    }

    console.log("\n📋 Test accounts created:");
    console.log("   Super Admin: superadmin / superadmin123");
    console.log("   Admin: admin_test / admin123");
    console.log("   Moderator: moderator_test / moderator123");
    console.log("   University Rep: university_rep_test / university123");
    console.log("   Student: student_test / student123");
  }
}
