import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("password_resets")
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar" })
  token: string;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @Column({ type: "timestamp", nullable: true })
  used_at: Date;

  @Column({ type: "varchar", nullable: true })
  ip_address: string;

  @Column({ type: "varchar", nullable: true })
  user_agent: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
