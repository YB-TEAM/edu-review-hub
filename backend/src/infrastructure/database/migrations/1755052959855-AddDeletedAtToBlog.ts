import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtToBlog1755052959855 implements MigrationInterface {
    name = 'AddDeletedAtToBlog1755052959855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasDeletedAt = await queryRunner.hasColumn("blogs", "deleted_at");
        if (!hasDeletedAt) {
            await queryRunner.query(`ALTER TABLE "blogs" ADD "deleted_at" TIMESTAMP`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN IF EXISTS "deleted_at"`);
    }
}
