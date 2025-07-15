import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateUserActivities1703123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_activities",
        columns: [
          {
            name: "id",
            type: "bigint",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "user_id",
            type: "bigint",
            isNullable: true,
          },
          {
            name: "activity_type",
            type: "enum",
            enum: [
              "profile_created",
              "profile_updated",
              "profile_deleted",
              "avatar_uploaded",
              "avatar_deleted",
              "account_deactivated",
              "account_deleted",
              "account_reactivated",
              "login_success",
              "login_failed",
              "logout",
              "password_changed",
              "password_reset_requested",
              "password_reset_completed",
              "email_verified",
              "email_verification_sent",
              "two_factor_enabled",
              "two_factor_disabled",
              "suspicious_activity_detected",
              "review_submitted",
              "review_updated",
              "review_deleted",
              "review_liked",
              "review_unliked",
              "review_reported",
            ],
          },
          {
            name: "description",
            type: "text",
          },
          {
            name: "metadata",
            type: "json",
            isNullable: true,
          },
          {
            name: "ip_address",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "user_agent",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Tạo indexes
    await queryRunner.createIndex(
      "user_activities",
      new TableIndex({
        name: "IDX_USER_ACTIVITIES_USER_ID",
        columnNames: ["user_id"],
      })
    );

    await queryRunner.createIndex(
      "user_activities",
      new TableIndex({
        name: "IDX_USER_ACTIVITIES_ACTIVITY_TYPE",
        columnNames: ["activity_type"],
      })
    );

    await queryRunner.createIndex(
      "user_activities",
      new TableIndex({
        name: "IDX_USER_ACTIVITIES_CREATED_AT",
        columnNames: ["created_at"],
      })
    );

    // Tạo foreign key
    await queryRunner.query(`
      ALTER TABLE user_activities 
      ADD CONSTRAINT FK_USER_ACTIVITIES_USER_ID 
      FOREIGN KEY (user_id) REFERENCES users(id) 
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_activities");
  }
}
