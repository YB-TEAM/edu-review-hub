import { AppDataSource } from "../data-source";
import { RolePermissionSeeder } from "./role-permission.seeder";
import { UserAccountSeeder } from "./user-account.seeder";
import { UniversitySeeder } from "./university.seeder";

async function runSeeds() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("Database connection established");

    // Run role and permission seeder
    const rolePermissionSeeder = new RolePermissionSeeder(AppDataSource);
    await rolePermissionSeeder.run();
    console.log("Role and permission seeding completed");

    // Run user account seeder
    const userAccountSeeder = new UserAccountSeeder(AppDataSource);
    await userAccountSeeder.run();
    console.log("User account seeding completed");

    // Run university seeder
    const universitySeeder = new UniversitySeeder(AppDataSource);
    await universitySeeder.run();
    console.log("University seeding completed");

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
