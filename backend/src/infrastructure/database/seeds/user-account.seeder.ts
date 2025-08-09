import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { UserRole } from "../entities/user-role.entity";
import { UserProfile, Gender } from "../entities/user-profile.entity";
import * as bcrypt from "bcryptjs";

export class UserAccountSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const userRepository = this.dataSource.getRepository(User);
    const roleRepository = this.dataSource.getRepository(Role);
    const userRoleRepository = this.dataSource.getRepository(UserRole);
    const userProfileRepository = this.dataSource.getRepository(UserProfile);

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
        userRoleRepository,
        userProfileRepository
      );
    }

    // Create test accounts for each role
    await this.createTestAccounts(
      userRepository,
      roleRepository,
      userRoleRepository,
      userProfileRepository
    );
  }

  private async createSuperAdmin(
    userRepository: any,
    roleRepository: any,
    userRoleRepository: any,
    userProfileRepository: any
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

    // Create profile for super admin if not exists
    const existingProfile = await userProfileRepository.findOne({
      where: { userId: superAdmin.id },
    });
    if (!existingProfile) {
      const profile = userProfileRepository.create({
        userId: superAdmin.id,
        firstName: "Super",
        lastName: "Admin",
        displayName: "Super Admin",
        bio: "System Super Admin",
        gender: Gender.OTHER,
        country: "Vietnam",
        city: "Hanoi",
        timezone: "UTC",
        language: "vi",
        privacySettings: {
          profileVisibility: "private",
          showEmail: false,
          showActivity: false,
        },
        notificationSettings: {
          email: true,
          push: false,
          marketing: false,
        },
      });
      await userProfileRepository.save(profile);
      console.log("🧩 Super admin profile created");
    }

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
    userRoleRepository: any,
    userProfileRepository: any
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

      // Create profile if not exists
      const existingProfile = await userProfileRepository.findOne({
        where: { userId: user.id },
      });
      if (!existingProfile) {
        // Derive display name from role
        const roleDisplayMap: Record<string, string> = {
          admin: "Admin",
          moderator: "Moderator",
          university_representative: "University Representative",
          student: "Student",
        };
        const roleDisplay = roleDisplayMap[accountData.roleName] || "User";

        const profile = userProfileRepository.create({
          userId: user.id,
          firstName: roleDisplay.split(" ")[0],
          lastName: roleDisplay.split(" ").slice(1).join(" ") || roleDisplay,
          displayName: `${roleDisplay} Test`,
          bio: `Test account for ${roleDisplay.toLowerCase()}`,
          gender: Gender.OTHER,
          country: "Vietnam",
          city: "Hanoi",
          timezone: "UTC",
          language: "vi",
          privacySettings: {
            profileVisibility: "private",
            showEmail: false,
            showActivity: false,
          },
          notificationSettings: {
            email: true,
            push: false,
            marketing: false,
          },
        });
        await userProfileRepository.save(profile);
        console.log(`🧩 Created profile for ${accountData.username}`);
      }

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
