import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UniversityReviewScore } from "./university-review-score.entity";

export enum CriterionType {
  ACADEMIC = "academic",
  FACILITY = "facility",
  SOCIAL = "social",
  CAREER = "career",
  OVERALL = "overall",
}

export enum CriterionWeight {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

@Entity("university_review_criteria")
export class UniversityReviewCriterion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  display_name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "enum", enum: CriterionType, default: CriterionType.OVERALL })
  type: CriterionType;

  @Column({ type: "enum", enum: CriterionWeight, default: CriterionWeight.MEDIUM })
  weight: CriterionWeight;

  @Column({ type: "int", default: 5 })
  max_score: number;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "boolean", default: false })
  is_required: boolean;

  @Column({ type: "int", default: 0 })
  sort_order: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  icon: string;

  @Column({ type: "varchar", length: 7, nullable: true })
  color: string;

  @OneToMany(() => UniversityReviewScore, (score) => score.criterion)
  scores: UniversityReviewScore[];

  // Computed properties
  get isAcademic(): boolean {
    return this.type === CriterionType.ACADEMIC;
  }

  get isFacility(): boolean {
    return this.type === CriterionType.FACILITY;
  }

  get isSocial(): boolean {
    return this.type === CriterionType.SOCIAL;
  }

  get isCareer(): boolean {
    return this.type === CriterionType.CAREER;
  }

  get isOverall(): boolean {
    return this.type === CriterionType.OVERALL;
  }

  get displayLabel(): string {
    return this.display_name || this.name;
  }

  get weightedScore(): number {
    return this.max_score * this.weight;
  }
}
