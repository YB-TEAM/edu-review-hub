import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ResourceEnum } from "../../../domain/rbac-management/enums/resource.enum";
import { ActionEnum } from "../../../domain/rbac-management/enums/action.enum";

@Entity('permissions')
export class PermissionOrm{
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: ResourceEnum,
    enumName: 'resource_enum'
  })
  resource: ResourceEnum;

  @Column({
    type: 'enum',
    enum: ActionEnum,
    enumName: 'action_enum'
  })
  action: ActionEnum;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt: Date;
}