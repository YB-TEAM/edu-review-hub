import { ValueObject } from "../../common/primitives/value-object";

export class HashPassword extends ValueObject{
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  private static validate(value: string): boolean {
    return value.length >= 8;
  }

  static create(value: string): HashPassword | null {
    if (!value || !this.validate(value)) {
      return null;
    }
    return new this(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: HashPassword): boolean {
    return this._value === other.value;
  }
}