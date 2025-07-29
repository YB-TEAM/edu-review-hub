import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { User } from "./user.entity";
import { Blog } from "./blog.entity";

@Entity("blog_likes")
@Unique(["userId", "blogId"])
export class BlogLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint" })
  userId: number;

  @Column({ type: "bigint" })
  blogId: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.blogLikes)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.likes)
  @JoinColumn({ name: "blog_id" })
  blog: Blog;
}
