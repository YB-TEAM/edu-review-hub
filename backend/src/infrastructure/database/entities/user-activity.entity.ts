import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum ActivityType {
  // Profile activities
  PROFILE_CREATED = "profile_created",
  PROFILE_UPDATED = "profile_updated",
  PROFILE_DELETED = "profile_deleted",
  AVATAR_UPLOADED = "avatar_uploaded",
  AVATAR_DELETED = "avatar_deleted",

  // Account activities
  ACCOUNT_DEACTIVATED = "account_deactivated",
  ACCOUNT_DELETED = "account_deleted",
  ACCOUNT_REACTIVATED = "account_reactivated",

  // Authentication activities
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  PASSWORD_CHANGED = "password_changed",
  PASSWORD_RESET_REQUESTED = "password_reset_requested",
  PASSWORD_RESET_COMPLETED = "password_reset_completed",

  // Email activities
  EMAIL_VERIFIED = "email_verified",
  EMAIL_VERIFICATION_SENT = "email_verification_sent",

  // Security activities
  TWO_FACTOR_ENABLED = "two_factor_enabled",
  TWO_FACTOR_DISABLED = "two_factor_disabled",
  SUSPICIOUS_ACTIVITY_DETECTED = "suspicious_activity_detected",

  // Review activities
  REVIEW_SUBMITTED = "review_submitted",
  REVIEW_UPDATED = "review_updated",
  REVIEW_DELETED = "review_deleted",
  REVIEW_LIKED = "review_liked",
  REVIEW_UNLIKED = "review_unliked",
  REVIEW_REPORTED = "review_reported",

  // Blog activities
  BLOG_CREATED = "blog_created",
  BLOG_UPDATED = "blog_updated",
  BLOG_DELETED = "blog_deleted",
  BLOG_PUBLISHED = "blog_published",
  BLOG_MODERATED = "blog_moderated",
  BLOG_LIKED = "blog_liked",
  BLOG_UNLIKED = "blog_unliked",
  BLOG_VIEWED = "blog_viewed",

  // Tag activities
  TAG_CREATED = "tag_created",
  TAG_UPDATED = "tag_updated",
  TAG_DELETED = "tag_deleted",
  TAG_ASSIGNED = "tag_assigned",
  TAG_REMOVED = "tag_removed",

  // Upload activities
  UPLOAD_IMAGE = "upload_image",
  UPDATE_IMAGE = "update_image",
  DELETE_IMAGE = "delete_image",
}

@Entity("user_activities")
export class UserActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint", nullable: true })
  userId: number;

  @Column({
    type: "enum",
    enum: ActivityType,
  })
  activityType: ActivityType;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: "text", nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;
}
