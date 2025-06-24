import { ValueObject } from "../../core/primitives/value-object";

export class RoleId extends ValueObject{
  protected readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: RoleId): boolean {
    return this.value === other.value;
  }
}