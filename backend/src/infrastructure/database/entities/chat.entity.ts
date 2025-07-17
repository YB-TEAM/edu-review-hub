import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("chats")
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  session_id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "boolean", default: false })
  is_anonymous: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
