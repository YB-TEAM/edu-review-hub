import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity('blog_images')
@Index(['blogId', 'imageUrl'], { unique: true })
@Index(['imageUrl'])
export class BlogImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'blog_id', type: 'integer' })
  blogId: number;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string;

  @Column({ name: 'alt_text', type: 'varchar', length: 500, nullable: true })
  altText: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
