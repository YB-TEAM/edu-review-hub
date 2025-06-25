import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserStatusEnum } from "../../../domain/profile-management/enums/user-status.enum";

@Entity('users')
export class UserOrm{
  @PrimaryColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  hashPassword: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.active,
    enumName: 'user_status_enum',
  })
  status: UserStatusEnum;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}