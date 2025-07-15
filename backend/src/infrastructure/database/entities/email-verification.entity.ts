import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum EmailVerificationType {
  EMAIL_VERIFICATION = "email_verification",
  PASSWORD_RESET = "password_reset",
  EMAIL_CHANGE = "email_change",
}

export enum EmailVerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  EXPIRED = "expired",
  USED = "used",
}

@Entity("email_verifications")
export class EmailVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint" })
  userId: number;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255, unique: true })
  token: string;

  @Column({
    type: "enum",
    enum: EmailVerificationType,
  })
  type: EmailVerificationType;

  @Column({
    type: "enum",
    enum: EmailVerificationStatus,
    default: EmailVerificationStatus.PENDING,
  })
  status: EmailVerificationStatus;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @Column({ type: "timestamp", nullable: true })
  verifiedAt: Date;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: "text", nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;
}
