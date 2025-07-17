import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("security_logs")
export class SecurityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar" })
  type: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
