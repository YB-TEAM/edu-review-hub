import { UUID } from "crypto";
import { ValueObject } from "../../common/primitives/value-object";

export class RoleId extends ValueObject{
  private readonly _value: UUID;

  private constructor(value: UUID) {
    super();
    this._value = value;
  }

  static create(): RoleId {
    return new this(crypto.randomUUID());
  }

  get value(): UUID {
    return this._value;
  }

  equals(other: RoleId): boolean {
    return this._value === other.value;
  }
}