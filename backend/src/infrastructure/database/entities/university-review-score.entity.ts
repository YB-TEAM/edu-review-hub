import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UniversityReview } from "./university-review.entity";
import { UniversityReviewCriterion } from "./university-review-criterion.entity";

@Entity("university_review_scores")
export class UniversityReviewScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UniversityReview, { nullable: false })
  @JoinColumn({ name: "review_id" })
  review: UniversityReview;

  @ManyToOne(() => UniversityReviewCriterion, { nullable: false })
  @JoinColumn({ name: "criterion_id" })
  criterion: UniversityReviewCriterion;

  @Column({ type: "int" })
  score: number;
}
