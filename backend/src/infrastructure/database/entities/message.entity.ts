import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Chat } from "./chat.entity";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, { nullable: false })
  @JoinColumn({ name: "chat_id" })
  chat: Chat;

  @Column({ type: "varchar" })
  sender: string;

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
