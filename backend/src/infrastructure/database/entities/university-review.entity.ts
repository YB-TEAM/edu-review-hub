import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { University } from "./university.entity";
import { User } from "./user.entity";
import { UniversityReviewScore } from "./university-review-score.entity";

@Entity("university_reviews")
export class UniversityReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => University, { nullable: false })
  @JoinColumn({ name: "university_id" })
  university: University;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "float" })
  overall_score: number;

  @Column({ type: "varchar" })
  status: string;

  @OneToMany(() => UniversityReviewScore, (score) => score.review, {
    cascade: true,
  })
  scores: UniversityReviewScore[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at: Date;
}
