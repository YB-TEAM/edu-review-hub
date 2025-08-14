import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./user.entity";
import { Tag } from "./tag.entity";
import { BlogLike } from "./blog-like.entity";

export enum BlogStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  APPROVED = "approved",
  REJECTED = "rejected",
  BANNED = "banned",
}

export enum BlogCategory {
  NEWS = "news",
  GUIDE = "guide",
  REVIEW = "review",
  INTERVIEW = "interview",
  OPINION = "opinion",
  OTHER = "other",
}

@Entity("blogs")
@Index(["status", "createdAt"])
@Index(["authorId", "status"])
@Index(["category", "status"])
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  excerpt?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  featuredImage?: string;

  @Column({ type: "enum", enum: BlogCategory, default: BlogCategory.OTHER })
  category: BlogCategory;

  @Column({ type: "enum", enum: BlogStatus, default: BlogStatus.DRAFT })
  status: BlogStatus;

  @Column({ type: "text", nullable: true })
  moderationReason?: string;

  @Column({ type: "int", default: 0 })
  viewCount: number;

  @Column({ type: "int", default: 0 })
  likeCount: number;

  @Column({ type: "int", default: 0 })
  commentCount: number;

  @Column({ type: "timestamp", nullable: true })
  publishedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  moderatedAt?: Date;

  @Column({ type: "bigint", nullable: true })
  authorId: number;

  @Column({ type: "bigint", nullable: true })
  moderatorId?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: "authorId" })
  author: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "moderator_id" })
  moderator?: User;

  @ManyToMany(() => Tag, (tag) => tag.blogs)
  tags: Tag[];

  @OneToMany(() => BlogLike, (like) => like.blog)
  likes: BlogLike[];
}
