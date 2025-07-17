import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UniversityReview } from "./university-review.entity";

@Entity("university_review_scores")
export class UniversityReviewScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UniversityReview, { nullable: false })
  @JoinColumn({ name: "review_id" })
  review: UniversityReview;

  @Column({ type: "varchar" })
  criterion: string;

  @Column({ type: "int" })
  score: number;
}
