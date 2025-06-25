import { PrimaryColumn, UpdateDateColumn } from "typeorm";

export class RolePermissionOrm{
  @PrimaryColumn({
    type: 'uuid',
  })
  roleId: string;

  @PrimaryColumn({
    type: 'uuid',
  })
  permissionId: string;

  @UpdateDateColumn({
    name: 'granted_at'
  })
  grantedAt: Date;
}