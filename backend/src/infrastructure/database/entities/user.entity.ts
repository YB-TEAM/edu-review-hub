import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { UserProfile } from "./user-profile.entity";
import { UserSession } from "./user-session.entity";
import { UserDevice } from "./user-device.entity";
import { Role } from "./role.entity";
import { UserActivity } from "./user-activity.entity";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  BANNED = "banned",
  DELETED = "deleted",
}

export enum AccountType {
  STUDENT = "student",
  UNIVERSITY_REP = "university_rep",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  username: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "timestamp", nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: "varchar", length: 255 })
  passwordHash: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone: string;

  @Column({ type: "timestamp", nullable: true })
  phoneVerifiedAt: Date;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: "enum",
    enum: AccountType,
    default: AccountType.STUDENT,
  })
  accountType: AccountType;

  @Column({ type: "boolean", default: false })
  isVerified: boolean;

  @Column({ type: "timestamp", nullable: true })
  lastLoginAt: Date;

  @Column({ type: "timestamp", nullable: true })
  lastActivityAt: Date;

  @Column({ type: "int", default: 0 })
  failedLoginAttempts: number;

  @Column({ type: "timestamp", nullable: true })
  lockedUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  @JoinColumn({ name: "id" })
  profile: UserProfile;

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];

  @OneToMany(() => UserDevice, (device) => device.user)
  devices: UserDevice[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles: Role[];

  @OneToMany(() => UserActivity, (activity) => activity.user)
  activities: UserActivity[];
}
