import { MigrationInterface, QueryRunner } from "typeorm";

export class EnhanceUniversitySystem1753262467863 implements MigrationInterface {
    name = 'EnhanceUniversitySystem1753262467863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update universities table
        await queryRunner.query(`ALTER TABLE "universities" ADD "short_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "english_name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "address" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "city" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "province" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "phone" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "email" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "website" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "facebook" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "banner_url" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "history" text`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "mission" text`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "vision" text`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "type" character varying NOT NULL DEFAULT 'public'`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "founded_year" integer`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "accreditation" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "specializations" text`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "facilities" text`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "achievements" text`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "ranking_national" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "ranking_international" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "student_count" integer`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "faculty_count" integer`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "acceptance_rate" decimal(5,2)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "tuition_fee_min" decimal(10,2)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "tuition_fee_max" decimal(10,2)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "currency" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "admission_requirements" text`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "scholarships" text`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "international_partnerships" text`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "campus_map_url" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "latitude" decimal(10,6)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "longitude" decimal(10,6)`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "is_featured" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "view_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "review_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "average_rating" decimal(3,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "universities" ADD "total_rating" integer NOT NULL DEFAULT '0'`);

        // Update university_reviews table
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "university_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "user_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "pros" text`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "cons" text`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "recommendation" text`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "review_type" character varying NOT NULL DEFAULT 'student'`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "study_program" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "study_year" integer`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "graduation_year" integer`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "is_anonymous" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "is_helpful" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "helpful_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "report_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "admin_notes" text`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "moderator_id" bigint`);
        await queryRunner.query(`ALTER TABLE "university_reviews" ADD "moderated_at" TIMESTAMP`);

        // Update university_review_criteria table
        await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "display_name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "type" character varying NOT NULL DEFAULT 'overall'`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "weight" integer NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "max_score" integer NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "is_required" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "sort_order" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "icon" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "color" character varying(7)`);

        // Create indexes
        await queryRunner.query(`CREATE INDEX "IDX_universities_name" ON "universities" ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_universities_type_status" ON "universities" ("type", "status")`);
        await queryRunner.query(`CREATE INDEX "IDX_universities_location_status" ON "universities" ("location", "status")`);
        await queryRunner.query(`CREATE INDEX "IDX_university_reviews_university_status" ON "university_reviews" ("university_id", "status")`);
        await queryRunner.query(`CREATE INDEX "IDX_university_reviews_user_created" ON "university_reviews" ("user_id", "created_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_university_reviews_score_created" ON "university_reviews" ("overall_score", "created_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_university_reviews_score_created"`);
        await queryRunner.query(`DROP INDEX "IDX_university_reviews_user_created"`);
        await queryRunner.query(`DROP INDEX "IDX_university_reviews_university_status"`);
        await queryRunner.query(`DROP INDEX "IDX_universities_location_status"`);
        await queryRunner.query(`DROP INDEX "IDX_universities_type_status"`);
        await queryRunner.query(`DROP INDEX "IDX_universities_name"`);

        // Revert university_review_criteria changes
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN "sort_order"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN "is_required"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN "max_score"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN "display_name"`);

        // Revert university_reviews changes
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "moderated_at"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "moderator_id"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "admin_notes"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "report_count"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "helpful_count"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "is_helpful"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "is_verified"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "is_anonymous"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "graduation_year"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "study_year"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "study_program"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "review_type"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "recommendation"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "cons"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "pros"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN "university_id"`);

        // Revert universities changes
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "total_rating"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "review_count"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "view_count"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "is_verified"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "is_featured"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "campus_map_url"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "international_partnerships"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "scholarships"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "admission_requirements"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "tuition_fee_max"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "tuition_fee_min"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "acceptance_rate"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "faculty_count"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "student_count"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "ranking_international"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "ranking_national"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "achievements"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "facilities"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "specializations"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "accreditation"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "founded_year"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "vision"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "mission"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "history"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "banner_url"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "facebook"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "province"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "english_name"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN "short_name"`);
    }
} 