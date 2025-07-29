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

export enum FileStatus {
  ACTIVE = "active",
  DELETED = "deleted",
}

@Entity("uploaded_files")
export class UploadedFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  publicId: string;

  @Column({ type: "varchar", length: 500 })
  secureUrl: string;

  @Column({ type: "varchar", length: 500 })
  url: string;

  @Column({ type: "varchar", length: 100 })
  fileName: string;

  @Column({ type: "varchar", length: 50 })
  fileType: string;

  @Column({ type: "bigint" })
  fileSize: number;

  @Column({ type: "int" })
  width: number;

  @Column({ type: "int" })
  height: number;

  @Column({ type: "varchar", length: 20 })
  format: string;

  @Column({ type: "varchar", length: 100, default: "edu-review-hub" })
  folder: string;

  @Column({
    type: "enum",
    enum: FileStatus,
    default: FileStatus.ACTIVE,
  })
  status: FileStatus;

  @Column({ type: "bigint" })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;
}
