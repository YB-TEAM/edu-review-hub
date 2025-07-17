import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar" })
  refresh_token: string;

  @Column({ type: "varchar", nullable: true })
  device_id: string;

  @Column({ type: "varchar", nullable: true })
  ip_address: string;

  @Column({ type: "varchar", nullable: true })
  user_agent: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "timestamp", nullable: true })
  expires_at: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
