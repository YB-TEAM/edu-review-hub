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

export enum DeviceType {
  WEB = "web",
  MOBILE = "mobile",
  TABLET = "tablet",
  DESKTOP = "desktop",
}

@Entity("user_devices")
export class UserDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint" })
  userId: number;

  @Column({ type: "varchar", length: 255, unique: true })
  deviceId: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  deviceName: string;

  @Column({
    type: "enum",
    enum: DeviceType,
  })
  deviceType: DeviceType;

  @Column({ type: "varchar", length: 50, nullable: true })
  platform: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  browser: string;

  @Column({ type: "boolean", default: false })
  isTrusted: boolean;

  @Column({ type: "varchar", length: 500, nullable: true })
  pushToken: string;

  @Column({ type: "timestamp" })
  lastUsedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn({ name: "user_id" })
  user: User;
}
