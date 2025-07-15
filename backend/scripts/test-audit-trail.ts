import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { IUserActivityService } from "../src/application/services/user-activity.service.interface";
import { ActivityType } from "../src/infrastructure/database/entities/user-activity.entity";

async function testAuditTrail() {
  console.log("🚀 Testing Audit Trail System...\n");

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userActivityService = app.get<IUserActivityService>(
      "IUserActivityService"
    );

    const testUserId = 1;
    const testIpAddress = "192.168.1.100";
    const testUserAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

    console.log("📝 Testing basic activity logging...");

    // Test log activity cơ bản
    await userActivityService.logActivity(
      testUserId,
      ActivityType.LOGIN_SUCCESS,
      "Đăng nhập thành công",
      { method: "email", device: "web" },
      testIpAddress,
      testUserAgent
    );
    console.log("✅ Basic activity logged");

    // Test log profile activity
    const oldProfileData = {
      firstName: "Nguyễn",
      lastName: "Văn A",
      email: "nguyenvana@example.com",
      phone: "0123456789",
    };

    const newProfileData = {
      firstName: "Nguyễn",
      lastName: "Văn B",
      email: "nguyenvana@example.com",
      phone: "0987654321",
    };

    await userActivityService.logProfileActivity(
      testUserId,
      ActivityType.PROFILE_UPDATED,
      oldProfileData,
      newProfileData,
      testIpAddress,
      testUserAgent
    );
    console.log("✅ Profile activity logged");

    // Test log avatar upload
    await userActivityService.logProfileActivity(
      testUserId,
      ActivityType.AVATAR_UPLOADED,
      { avatarUrl: "https://old-avatar.jpg" },
      { avatarUrl: "https://new-avatar.jpg" },
      testIpAddress,
      testUserAgent
    );
    console.log("✅ Avatar activity logged");

    // Test get user activities
    console.log("\n📊 Testing activity retrieval...");
    const activities = await userActivityService.getUserActivities(
      testUserId,
      10,
      0
    );
    console.log(`✅ Retrieved ${activities.length} activities`);

    // Test get activity count
    const count = await userActivityService.getActivityCount(testUserId);
    console.log(`✅ Total activities: ${count}`);

    // Display sample activities
    console.log("\n📋 Sample Activities:");
    activities.slice(0, 3).forEach((activity, index) => {
      console.log(
        `${index + 1}. ${activity.activityType}: ${activity.description}`
      );
      console.log(`   IP: ${activity.ipAddress}`);
      console.log(`   Time: ${activity.createdAt}`);
      if (activity.metadata) {
        console.log(
          `   Metadata: ${JSON.stringify(activity.metadata, null, 2)}`
        );
      }
      console.log("");
    });

    console.log("🎉 Audit Trail test completed successfully!");
  } catch (error) {
    console.error("❌ Error testing audit trail:", error);
  } finally {
    await app.close();
  }
}

// Chạy test nếu file được execute trực tiếp
if (require.main === module) {
  testAuditTrail().catch(console.error);
}

export { testAuditTrail };
