import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBanFieldsToUser1753262467862 implements MigrationInterface {
  name = "AddBanFieldsToUser1753262467862";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before adding them
    const hasIsBanned = await queryRunner.hasColumn("users", "isBanned");
    const hasBanReason = await queryRunner.hasColumn("users", "banReason");
    const hasBannedAt = await queryRunner.hasColumn("users", "bannedAt");
    const hasBanExpiresAt = await queryRunner.hasColumn(
      "users",
      "banExpiresAt"
    );

    if (!hasIsBanned) {
      await queryRunner.query(
        `ALTER TABLE "users" ADD "isBanned" boolean NOT NULL DEFAULT false`
      );
    }
    if (!hasBanReason) {
      await queryRunner.query(
        `ALTER TABLE "users" ADD "banReason" character varying(500)`
      );
    }
    if (!hasBannedAt) {
      await queryRunner.query(`ALTER TABLE "users" ADD "bannedAt" TIMESTAMP`);
    }
    if (!hasBanExpiresAt) {
      await queryRunner.query(
        `ALTER TABLE "users" ADD "banExpiresAt" TIMESTAMP`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "banExpiresAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "bannedAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "banReason"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "isBanned"`
    );
  }
}
