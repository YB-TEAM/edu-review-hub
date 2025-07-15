import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

@Entity("user_profiles")
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint" })
  userId: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  firstName: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  lastName: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  displayName: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  coverImageUrl: string;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth: Date;

  @Column({
    type: "enum",
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ type: "varchar", length: 100, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  city: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ type: "varchar", length: 50, default: "UTC" })
  timezone: string;

  @Column({ type: "varchar", length: 10, default: "vi" })
  language: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  universityName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  major: string;

  @Column({ type: "int", nullable: true })
  graduationYear: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  studentId: string;

  @Column({ type: "boolean", default: false })
  isStudentVerified: boolean;

  @Column({ type: "json", nullable: true })
  privacySettings: Record<string, any>;

  @Column({ type: "json", nullable: true })
  notificationSettings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: "user_id" })
  user: User;
}
