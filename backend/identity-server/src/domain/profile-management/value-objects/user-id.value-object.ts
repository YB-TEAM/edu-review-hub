import { ValueObject } from "../../common/primitives/value-object";

export class UserId extends ValueObject {
  protected readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  static createUnique(): UserId {
    return new UserId(crypto.randomUUID());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.getValue();
  }
}