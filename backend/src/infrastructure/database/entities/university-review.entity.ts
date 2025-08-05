import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { University } from "./university.entity";
import { User } from "./user.entity";
import { UniversityReviewScore } from "./university-review-score.entity";

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  HIDDEN = "hidden",
}

export enum ReviewType {
  STUDENT = "student",
  ALUMNI = "alumni",
  PARENT = "parent",
  VISITOR = "visitor",
  STAFF = "staff",
}

@Entity("university_reviews")
@Index(["university_id", "status"])
@Index(["user_id", "created_at"])
@Index(["overall_score", "created_at"])
export class UniversityReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint" })
  university_id: number;

  @Column({ type: "bigint" })
  user_id: number;

  @ManyToOne(() => University, { nullable: false })
  @JoinColumn({ name: "university_id" })
  university: University;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "text", nullable: true })
  pros: string;

  @Column({ type: "text", nullable: true })
  cons: string;

  @Column({ type: "text", nullable: true })
  recommendation: string;

  @Column({ type: "float" })
  overall_score: number;

  @Column({ type: "enum", enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @Column({ type: "enum", enum: ReviewType, default: ReviewType.STUDENT })
  review_type: ReviewType;

  @Column({ type: "varchar", length: 100, nullable: true })
  study_program: string;

  @Column({ type: "int", nullable: true })
  study_year: number;

  @Column({ type: "int", nullable: true })
  graduation_year: number;

  @Column({ type: "boolean", default: false })
  is_anonymous: boolean;

  @Column({ type: "boolean", default: false })
  is_verified: boolean;

  @Column({ type: "boolean", default: false })
  is_helpful: boolean;

  @Column({ type: "int", default: 0 })
  helpful_count: number;

  @Column({ type: "int", default: 0 })
  report_count: number;

  @Column({ type: "text", nullable: true })
  admin_notes: string;

  @Column({ type: "bigint", nullable: true })
  moderator_id: number;

  @Column({ type: "timestamp", nullable: true })
  moderated_at: Date;

  @OneToMany(() => UniversityReviewScore, (score) => score.review, {
    cascade: true,
  })
  scores: UniversityReviewScore[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at: Date;

  // Computed properties
  get isApproved(): boolean {
    return this.status === ReviewStatus.APPROVED;
  }

  get isPending(): boolean {
    return this.status === ReviewStatus.PENDING;
  }

  get isRejected(): boolean {
    return this.status === ReviewStatus.REJECTED;
  }

  get isHidden(): boolean {
    return this.status === ReviewStatus.HIDDEN;
  }

  get displayName(): string {
    if (this.is_anonymous) {
      return `${this.review_type} (Anonymous)`;
    }
    return this.user?.username || `User ${this.user_id}`;
  }

  get ratingPercentage(): number {
    return this.overall_score * 20; // Convert 0-5 to 0-100
  }

  get isRecent(): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.created_at > thirtyDaysAgo;
  }
}
