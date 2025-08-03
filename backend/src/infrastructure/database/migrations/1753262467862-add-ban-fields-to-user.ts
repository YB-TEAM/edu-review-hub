import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBanFieldsToUser1753262467862 implements MigrationInterface {
    name = 'AddBanFieldsToUser1753262467862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isBanned" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "banReason" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bannedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "banExpiresAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "banExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bannedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "banReason"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isBanned"`);
    }
} 