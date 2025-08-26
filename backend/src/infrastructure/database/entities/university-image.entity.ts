import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { University } from "./university.entity";

export enum ImageType {
  LOGO = "logo",
  BANNER = "banner",
  CAMPUS = "campus",
  FACILITY = "facility",
  EVENT = "event",
  OTHER = "other",
}

@Entity("university_images")
@Index(["university_id", "image_type"])
@Index(["university_id", "is_primary"])
export class UniversityImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  university_id: number;

  @Column({ type: "varchar", length: 255 })
  image_url: string;

  @Column({ type: "varchar", length: 100 })
  cloudinary_public_id: string;

  @Column({ type: "varchar", length: 100 })
  image_type: ImageType;

  @Column({ type: "varchar", length: 255, nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  alt_text: string;

  @Column({ type: "int", default: 0 })
  sort_order: number;

  @Column({ type: "boolean", default: false })
  is_primary: boolean;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "varchar", length: 50, nullable: true })
  uploaded_by: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  ip_address: string;

  @Column({ type: "text", nullable: true })
  user_agent: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  // Relations
  @ManyToOne(() => University, (university) => university.images)
  @JoinColumn({ name: "university_id" })
  university: University;

  // Computed properties
  get displayTitle(): string {
    return this.title || `${this.image_type} image`;
  }

  get isLogo(): boolean {
    return this.image_type === ImageType.LOGO;
  }

  get isBanner(): boolean {
    return this.image_type === ImageType.BANNER;
  }
}
