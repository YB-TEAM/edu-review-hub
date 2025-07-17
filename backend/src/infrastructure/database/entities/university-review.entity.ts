import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { University } from "./university.entity";
import { User } from "./user.entity";

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

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @Column({ type: "timestamp", nullable: true })
  deleted_at: Date;
}
