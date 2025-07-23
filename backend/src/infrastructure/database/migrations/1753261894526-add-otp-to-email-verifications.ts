import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpToEmailVerifications1753261894526
  implements MigrationInterface
{
  name = "AddOtpToEmailVerifications1753261894526";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng nếu chưa có
    await queryRunner.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_verifications') THEN
                CREATE TABLE "email_verifications" (
                    "id" SERIAL PRIMARY KEY,
                    "user_id" integer NOT NULL,
                    "email" character varying NOT NULL,
                    "token" character varying NOT NULL,
                    "expires_at" timestamp NOT NULL,
                    "created_at" timestamp DEFAULT now(),
                    "updated_at" timestamp DEFAULT now()
                );
            END IF;
        END
        $$;
        `);
    // Thêm cột otp nếu chưa có
    await queryRunner.query(
      `ALTER TABLE "email_verifications" ADD COLUMN IF NOT EXISTS "otp" character varying(10)`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_87b8888186ca9769c960e92687"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_b23c65e50a758245a33ee35fda"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_178199805b901ccd220ab7740e"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_17022daf3f885f7d35423e9971"`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."users_accounttype_enum" RENAME TO "users_accounttype_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_accounttype_enum" AS ENUM('student', 'university_rep', 'admin', 'moderator', 'super_admin')`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "accountType" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "accountType" TYPE "public"."users_accounttype_enum" USING "accountType"::"text"::"public"."users_accounttype_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "accountType" SET DEFAULT 'student'`
    );
    await queryRunner.query(`DROP TYPE "public"."users_accounttype_enum_old"`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_b23c65e50a758245a33ee35fda"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_87b8888186ca9769c960e92687"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_17022daf3f885f7d35423e9971"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_178199805b901ccd220ab7740e"`
    );
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "public"."users_accounttype_enum_old" AS ENUM('student', 'university_rep', 'admin', 'moderator')`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "accountType" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "accountType" TYPE "public"."users_accounttype_enum_old" USING "accountType"::"text"::"public"."users_accounttype_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "accountType" SET DEFAULT 'student'`
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."users_accounttype_enum"`
    );
    await queryRunner.query(
      `ALTER TYPE IF EXISTS "public"."users_accounttype_enum_old" RENAME TO "users_accounttype_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "email_verifications" DROP COLUMN IF EXISTS "otp"`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
