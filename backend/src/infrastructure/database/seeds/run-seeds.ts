import { AppDataSource } from "../data-source";
import { RolePermissionSeeder } from "./role-permission.seeder";
import { UserAccountSeeder } from "./user-account.seeder";
import { EnhancedUniversitySeeder } from "./enhanced-university.seeder";
import { TagSeeder } from "./tag.seeder";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { University } from "../entities/university.entity";
import { Tag } from "../entities/tag.entity";

async function runSeeds() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("Database connection established");

    // Run role and permission seeder (skip if roles already exist)
    const roleRepository = AppDataSource.getRepository(Role);
    const roleCount = await roleRepository.count();
    if (roleCount === 0) {
      const rolePermissionSeeder = new RolePermissionSeeder(AppDataSource);
      await rolePermissionSeeder.run();
      console.log("Role and permission seeding completed");
    } else {
      console.log("⏭️ Roles already exist, skipping role/permission seeding");
    }

    // Run user account seeder (skip if any user exists or superadmin exists)
    const userRepository = AppDataSource.getRepository(User);
    const superAdminExists = await userRepository.findOne({ where: { username: "superadmin" } });
    const userCount = await userRepository.count();
    if (!superAdminExists && userCount === 0) {
      const userAccountSeeder = new UserAccountSeeder(AppDataSource);
      await userAccountSeeder.run();
      console.log("User account seeding completed");
    } else {
      console.log("⏭️ Users already exist, skipping user account seeding");
    }

    // Run enhanced university seeder (skip if any university exists)
    const universityRepository = AppDataSource.getRepository(University);
    const universityCount = await universityRepository.count();
    if (universityCount === 0) {
      const universitySeeder = new EnhancedUniversitySeeder(AppDataSource);
      await universitySeeder.run();
      console.log("Enhanced university seeding completed");
    } else {
      console.log("⏭️ Universities already exist, skipping university seeding");
    }

    // Run tag seeder (skip if any tag exists)
    const tagRepository = AppDataSource.getRepository(Tag);
    const tagCount = await tagRepository.count();
    if (tagCount === 0) {
      const tagSeeder = new TagSeeder(AppDataSource);
      await tagSeeder.run();
      console.log("Tag seeding completed");
    } else {
      console.log("⏭️ Tags already exist, skipping tag seeding");
    }

    // Close database connection
    await AppDataSource.destroy();
    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Error running seeds:", error);
    process.exit(1);
  }
}

runSeeds();
