import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("recommendations")
export class Recommendation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", nullable: true })
  personality_type: string;

  @Column({ type: "text", nullable: true })
  interests: string;

  @Column({ type: "float", nullable: true })
  academic_score: number;

  @Column({ type: "text", nullable: true })
  recommended_universities: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
