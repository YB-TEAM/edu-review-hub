import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum DeactivationType {
  DEACTIVATE = "deactivate",
  DELETE = "delete",
  REACTIVATE = "reactivate",
}

export enum DeactivationStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("account_deactivations")
export class AccountDeactivation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint" })
  userId: number;

  @Column({
    type: "enum",
    enum: DeactivationType,
  })
  type: DeactivationType;

  @Column({
    type: "enum",
    enum: DeactivationStatus,
    default: DeactivationStatus.PENDING,
  })
  status: DeactivationStatus;

  @Column({ type: "text", nullable: true })
  reason: string;

  @Column({ type: "timestamp", nullable: true })
  deactivatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  reactivatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  scheduledDeletionAt: Date;

  @Column({ type: "boolean", default: false })
  isPermanent: boolean;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: "text", nullable: true })
  userAgent: string;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;
}
