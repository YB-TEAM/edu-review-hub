import { MigrationInterface, QueryRunner } from "typeorm";

export class UniversityReviewCriterion1753288293334
  implements MigrationInterface
{
  name = "UniversityReviewCriterion1753288293334";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "university_review_criteria" (
            "id" SERIAL NOT NULL,
            "name" character varying NOT NULL,
            "description" character varying,
            CONSTRAINT "PK_university_review_criteria_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_university_review_criteria_name" UNIQUE ("name")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "university_review_criteria"`);
  }
}
