import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("user_sessions")
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint" })
  userId: number;

  @Column({ type: "varchar", length: 255, unique: true })
  sessionToken: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  refreshToken: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  deviceId: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: "text", nullable: true })
  userAgent: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  location: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @Column({ type: "timestamp" })
  lastActivityAt: Date;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: "user_id" })
  user: User;
}
