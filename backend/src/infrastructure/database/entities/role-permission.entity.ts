import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryColumn()
  role_id: number;

  @PrimaryColumn()
  permission_id: number;

  @ManyToOne(() => Role, { onDelete: "CASCADE" })
  @JoinColumn({ name: "role_id" })
  role: Role;

  @ManyToOne(() => Permission, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_id" })
  permission: Permission;
}
