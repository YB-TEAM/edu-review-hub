import { ValueObject } from "../../common/primitives/value-object";
import * as bcrypt from 'bcrypt';
export class Email extends ValueObject{
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  private static validate(value: string){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  static create(value: string): Email | null {
    if (!value || !this.validate(value)) {
      return null;
    }
    
    return new this(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other.value;
  }
}