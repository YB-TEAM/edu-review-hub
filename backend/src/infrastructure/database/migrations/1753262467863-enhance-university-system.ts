import { MigrationInterface, QueryRunner } from "typeorm";

export class EnhanceUniversitySystem1753262467863 implements MigrationInterface {
    name = 'EnhanceUniversitySystem1753262467863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update universities table
        const hasShortName = await queryRunner.hasColumn("universities", "short_name");
        const hasEnglishName = await queryRunner.hasColumn("universities", "english_name");
        const hasAddress = await queryRunner.hasColumn("universities", "address");
        const hasCity = await queryRunner.hasColumn("universities", "city");
        const hasProvince = await queryRunner.hasColumn("universities", "province");
        const hasPhone = await queryRunner.hasColumn("universities", "phone");
        const hasEmail = await queryRunner.hasColumn("universities", "email");
        const hasWebsite = await queryRunner.hasColumn("universities", "website");
        const hasFacebook = await queryRunner.hasColumn("universities", "facebook");
        const hasBannerUrl = await queryRunner.hasColumn("universities", "banner_url");
        const hasHistory = await queryRunner.hasColumn("universities", "history");
        const hasMission = await queryRunner.hasColumn("universities", "mission");
        const hasVision = await queryRunner.hasColumn("universities", "vision");
        const hasType = await queryRunner.hasColumn("universities", "type");
        const hasStatus = await queryRunner.hasColumn("universities", "status");
        const hasFoundedYear = await queryRunner.hasColumn("universities", "founded_year");
        const hasAccreditation = await queryRunner.hasColumn("universities", "accreditation");
        const hasSpecializations = await queryRunner.hasColumn("universities", "specializations");
        const hasFacilities = await queryRunner.hasColumn("universities", "facilities");
        const hasAchievements = await queryRunner.hasColumn("universities", "achievements");
        const hasRankingNational = await queryRunner.hasColumn("universities", "ranking_national");
        const hasRankingInternational = await queryRunner.hasColumn("universities", "ranking_international");
        const hasStudentCount = await queryRunner.hasColumn("universities", "student_count");
        const hasFacultyCount = await queryRunner.hasColumn("universities", "faculty_count");
        const hasAcceptanceRate = await queryRunner.hasColumn("universities", "acceptance_rate");
        const hasTuitionFeeMin = await queryRunner.hasColumn("universities", "tuition_fee_min");
        const hasTuitionFeeMax = await queryRunner.hasColumn("universities", "tuition_fee_max");
        const hasCurrency = await queryRunner.hasColumn("universities", "currency");
        const hasAdmissionRequirements = await queryRunner.hasColumn("universities", "admission_requirements");
        const hasScholarships = await queryRunner.hasColumn("universities", "scholarships");
        const hasInternationalPartnerships = await queryRunner.hasColumn("universities", "international_partnerships");
        const hasCampusMapUrl = await queryRunner.hasColumn("universities", "campus_map_url");
        const hasLatitude = await queryRunner.hasColumn("universities", "latitude");
        const hasLongitude = await queryRunner.hasColumn("universities", "longitude");
        const hasIsFeatured = await queryRunner.hasColumn("universities", "is_featured");
        const hasIsVerified = await queryRunner.hasColumn("universities", "is_verified");
        const hasViewCount = await queryRunner.hasColumn("universities", "view_count");
        const hasReviewCount = await queryRunner.hasColumn("universities", "review_count");
        const hasAverageRating = await queryRunner.hasColumn("universities", "average_rating");
        const hasTotalRating = await queryRunner.hasColumn("universities", "total_rating");

        if (!hasShortName) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "short_name" character varying(100)`);
        }
        if (!hasEnglishName) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "english_name" character varying(255)`);
        }
        if (!hasAddress) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "address" character varying(500)`);
        }
        if (!hasCity) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "city" character varying(100)`);
        }
        if (!hasProvince) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "province" character varying(100)`);
        }
        if (!hasPhone) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "phone" character varying(20)`);
        }
        if (!hasEmail) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "email" character varying(255)`);
        }
        if (!hasWebsite) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "website" character varying(500)`);
        }
        if (!hasFacebook) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "facebook" character varying(500)`);
        }
        if (!hasBannerUrl) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "banner_url" character varying(500)`);
        }
        if (!hasHistory) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "history" text`);
        }
        if (!hasMission) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "mission" text`);
        }
        if (!hasVision) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "vision" text`);
        }
        if (!hasType) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "type" character varying NOT NULL DEFAULT 'public'`);
        }
        if (!hasStatus) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        }
        if (!hasFoundedYear) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "founded_year" integer`);
        }
        if (!hasAccreditation) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "accreditation" character varying(100)`);
        }
        if (!hasSpecializations) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "specializations" text`);
        }
        if (!hasFacilities) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "facilities" text`);
        }
        if (!hasAchievements) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "achievements" text`);
        }
        if (!hasRankingNational) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "ranking_national" character varying(100)`);
        }
        if (!hasRankingInternational) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "ranking_international" character varying(100)`);
        }
        if (!hasStudentCount) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "student_count" integer`);
        }
        if (!hasFacultyCount) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "faculty_count" integer`);
        }
        if (!hasAcceptanceRate) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "acceptance_rate" decimal(5,2)`);
        }
        if (!hasTuitionFeeMin) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "tuition_fee_min" decimal(10,2)`);
        }
        if (!hasTuitionFeeMax) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "tuition_fee_max" decimal(10,2)`);
        }
        if (!hasCurrency) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "currency" character varying(20)`);
        }
        if (!hasAdmissionRequirements) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "admission_requirements" text`);
        }
        if (!hasScholarships) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "scholarships" text`);
        }
        if (!hasInternationalPartnerships) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "international_partnerships" text`);
        }
        if (!hasCampusMapUrl) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "campus_map_url" character varying(500)`);
        }
        if (!hasLatitude) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "latitude" decimal(10,6)`);
        }
        if (!hasLongitude) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "longitude" decimal(10,6)`);
        }
        if (!hasIsFeatured) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "is_featured" boolean NOT NULL DEFAULT false`);
        }
        if (!hasIsVerified) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        }
        if (!hasViewCount) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "view_count" integer NOT NULL DEFAULT '0'`);
        }
        if (!hasReviewCount) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "review_count" integer NOT NULL DEFAULT '0'`);
        }
        if (!hasAverageRating) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "average_rating" decimal(3,2) NOT NULL DEFAULT '0'`);
        }
        if (!hasTotalRating) {
            await queryRunner.query(`ALTER TABLE "universities" ADD "total_rating" integer NOT NULL DEFAULT '0'`);
        }

        // Update university_reviews table
        const hasUniversityId = await queryRunner.hasColumn("university_reviews", "university_id");
        const hasUserId = await queryRunner.hasColumn("university_reviews", "user_id");
        const hasPros = await queryRunner.hasColumn("university_reviews", "pros");
        const hasCons = await queryRunner.hasColumn("university_reviews", "cons");
        const hasRecommendation = await queryRunner.hasColumn("university_reviews", "recommendation");
        const hasReviewStatus = await queryRunner.hasColumn("university_reviews", "status");
        const hasReviewType = await queryRunner.hasColumn("university_reviews", "review_type");
        const hasStudyProgram = await queryRunner.hasColumn("university_reviews", "study_program");
        const hasStudyYear = await queryRunner.hasColumn("university_reviews", "study_year");
        const hasGraduationYear = await queryRunner.hasColumn("university_reviews", "graduation_year");
        const hasIsAnonymous = await queryRunner.hasColumn("university_reviews", "is_anonymous");
        const hasReviewIsVerified = await queryRunner.hasColumn("university_reviews", "is_verified");
        const hasIsHelpful = await queryRunner.hasColumn("university_reviews", "is_helpful");
        const hasHelpfulCount = await queryRunner.hasColumn("university_reviews", "helpful_count");
        const hasReportCount = await queryRunner.hasColumn("university_reviews", "report_count");
        const hasAdminNotes = await queryRunner.hasColumn("university_reviews", "admin_notes");
        const hasModeratorId = await queryRunner.hasColumn("university_reviews", "moderator_id");
        const hasModeratedAt = await queryRunner.hasColumn("university_reviews", "moderated_at");

        if (!hasUniversityId) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "university_id" bigint NOT NULL`);
        }
        if (!hasUserId) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "user_id" bigint NOT NULL`);
        }
        if (!hasPros) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "pros" text`);
        }
        if (!hasCons) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "cons" text`);
        }
        if (!hasRecommendation) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "recommendation" text`);
        }
        if (!hasReviewStatus) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        }
        if (!hasReviewType) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "review_type" character varying NOT NULL DEFAULT 'student'`);
        }
        if (!hasStudyProgram) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "study_program" character varying(100)`);
        }
        if (!hasStudyYear) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "study_year" integer`);
        }
        if (!hasGraduationYear) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "graduation_year" integer`);
        }
        if (!hasIsAnonymous) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "is_anonymous" boolean NOT NULL DEFAULT false`);
        }
        if (!hasReviewIsVerified) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        }
        if (!hasIsHelpful) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "is_helpful" boolean NOT NULL DEFAULT false`);
        }
        if (!hasHelpfulCount) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "helpful_count" integer NOT NULL DEFAULT '0'`);
        }
        if (!hasReportCount) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "report_count" integer NOT NULL DEFAULT '0'`);
        }
        if (!hasAdminNotes) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "admin_notes" text`);
        }
        if (!hasModeratorId) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "moderator_id" bigint`);
        }
        if (!hasModeratedAt) {
            await queryRunner.query(`ALTER TABLE "university_reviews" ADD "moderated_at" TIMESTAMP`);
        }

        // Update university_review_criteria table
        const hasDisplayName = await queryRunner.hasColumn("university_review_criteria", "display_name");
        const hasCriteriaType = await queryRunner.hasColumn("university_review_criteria", "type");
        const hasWeight = await queryRunner.hasColumn("university_review_criteria", "weight");
        const hasMaxScore = await queryRunner.hasColumn("university_review_criteria", "max_score");
        const hasIsActive = await queryRunner.hasColumn("university_review_criteria", "is_active");
        const hasIsRequired = await queryRunner.hasColumn("university_review_criteria", "is_required");
        const hasSortOrder = await queryRunner.hasColumn("university_review_criteria", "sort_order");
        const hasIcon = await queryRunner.hasColumn("university_review_criteria", "icon");
        const hasColor = await queryRunner.hasColumn("university_review_criteria", "color");

        if (!hasDisplayName) {
            await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "display_name" character varying(255)`);
        }
        if (!hasCriteriaType) {
            await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "type" character varying NOT NULL DEFAULT 'overall'`);
        }
        if (!hasWeight) {
            await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "weight" integer NOT NULL DEFAULT '2'`);
        }
        if (!hasMaxScore) {
            await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "max_score" integer NOT NULL DEFAULT '5'`);
        }
        if (!hasIsActive) {
            await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "is_active" boolean NOT NULL DEFAULT true`);
        }
        if (!hasIsRequired) {
            await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "is_required" boolean NOT NULL DEFAULT false`);
        }
        if (!hasSortOrder) {
            await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "sort_order" integer NOT NULL DEFAULT '0'`);
        }
        if (!hasIcon) {
            await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "icon" character varying(100)`);
        }
        if (!hasColor) {
            await queryRunner.query(`ALTER TABLE "university_review_criteria" ADD "color" character varying(7)`);
        }

        // Create indexes
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_universities_name" ON "universities" ("name")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_universities_type_status" ON "universities" ("type", "status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_universities_location_status" ON "universities" ("location", "status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_university_reviews_university_status" ON "university_reviews" ("university_id", "status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_university_reviews_user_created" ON "university_reviews" ("user_id", "created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_university_reviews_score_created" ON "university_reviews" ("overall_score", "created_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_university_reviews_score_created"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_university_reviews_user_created"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_university_reviews_university_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_universities_location_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_universities_type_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_universities_name"`);

        // Revert university_review_criteria changes
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN IF EXISTS "color"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN IF EXISTS "icon"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN IF EXISTS "sort_order"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN IF EXISTS "is_required"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN IF EXISTS "is_active"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN IF EXISTS "max_score"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN IF EXISTS "weight"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN IF EXISTS "type"`);
        await queryRunner.query(`ALTER TABLE "university_review_criteria" DROP COLUMN IF EXISTS "display_name"`);

        // Revert university_reviews changes
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "moderated_at"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "moderator_id"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "admin_notes"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "report_count"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "helpful_count"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "is_helpful"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "is_verified"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "is_anonymous"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "graduation_year"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "study_year"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "study_program"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "review_type"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "status"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "recommendation"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "cons"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "pros"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "user_id"`);
        await queryRunner.query(`ALTER TABLE "university_reviews" DROP COLUMN IF EXISTS "university_id"`);

        // Revert universities changes
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "total_rating"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "average_rating"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "review_count"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "view_count"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "is_verified"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "is_featured"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "longitude"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "latitude"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "campus_map_url"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "international_partnerships"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "scholarships"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "admission_requirements"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "currency"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "tuition_fee_max"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "tuition_fee_min"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "acceptance_rate"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "faculty_count"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "student_count"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "ranking_international"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "ranking_national"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "achievements"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "facilities"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "specializations"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "accreditation"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "founded_year"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "status"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "type"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "vision"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "mission"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "history"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "banner_url"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "facebook"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "website"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "email"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "phone"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "province"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "city"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "address"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "english_name"`);
        await queryRunner.query(`ALTER TABLE "universities" DROP COLUMN IF EXISTS "short_name"`);
    }
} 