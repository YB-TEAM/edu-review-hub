import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { UniversityReview } from "./university-review.entity";
import { UniversityImage } from "./university-image.entity";

export enum UniversityType {
  PUBLIC = "public",
  PRIVATE = "private",
  INTERNATIONAL = "international",
  COLLEGE = "college",
}

export enum UniversityStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

@Entity("universities")
@Index(["name"])
@Index(["type", "status"])
@Index(["location", "status"])
export class University {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  short_name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  english_name: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  address: string;

  @Column({ type: "simple-array", nullable: true })
  location: string[];

  @Column({ type: "varchar", length: 100, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  province: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  website: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  facebook: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  logo_url: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  banner_url: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  history: string;

  @Column({ type: "text", nullable: true })
  mission: string;

  @Column({ type: "text", nullable: true })
  vision: string;

  @Column({
    type: "enum",
    enum: UniversityType,
    default: UniversityType.PUBLIC,
  })
  type: UniversityType;

  @Column({
    type: "enum",
    enum: UniversityStatus,
    default: UniversityStatus.ACTIVE,
  })
  status: UniversityStatus;

  @Column({ type: "int", nullable: true })
  founded_year: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  accreditation: string;

  @Column({ type: "simple-array", nullable: true })
  specializations: string[];

  @Column({ type: "simple-array", nullable: true })
  facilities: string[];

  @Column({ type: "simple-array", nullable: true })
  achievements: string[];

  @Column({ type: "varchar", length: 100, nullable: true })
  ranking_national: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  ranking_international: string;

  @Column({ type: "int", nullable: true })
  student_count: number;

  @Column({ type: "int", nullable: true })
  faculty_count: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  acceptance_rate: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  tuition_fee_min: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  tuition_fee_max: number;

  @Column({ type: "varchar", length: 20, nullable: true })
  currency: string;

  @Column({ type: "simple-array", nullable: true })
  admission_requirements: string[];

  @Column({ type: "simple-array", nullable: true })
  scholarships: string[];

  @Column({ type: "simple-array", nullable: true })
  international_partnerships: string[];

  @Column({ type: "varchar", length: 500, nullable: true })
  campus_map_url: string;

  @Column({ type: "decimal", precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: "decimal", precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: "boolean", default: false })
  is_featured: boolean;

  @Column({ type: "boolean", default: false })
  is_verified: boolean;

  @Column({ type: "int", default: 0 })
  view_count: number;

  @Column({ type: "int", default: 0 })
  review_count: number;

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  average_rating: number;

  @Column({ type: "int", default: 0 })
  total_rating: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  // Relations
  @OneToMany(() => UniversityReview, (review) => review.university)
  reviews: UniversityReview[];

  @OneToMany(() => UniversityImage, (image) => image.university)
  images: UniversityImage[];

  // Computed properties
  get fullAddress(): string {
    const parts = [this.address, this.city, this.province].filter(Boolean);
    return parts.join(", ");
  }

  get displayName(): string {
    return this.short_name || this.name;
  }

  get isActive(): boolean {
    return this.status === UniversityStatus.ACTIVE;
  }

  get hasLocation(): boolean {
    return !!(this.latitude && this.longitude);
  }

  get ratingPercentage(): number {
    return this.average_rating * 20; // Convert 0-5 to 0-100
  }
}
