import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("university_review_criteria")
export class UniversityReviewCriterion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  name: string;

  @Column({ type: "varchar", nullable: true })
  description?: string;
}
