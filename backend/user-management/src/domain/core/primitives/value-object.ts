export abstract class ValueObject{
  constructor() {
  }

  abstract equals(other: ValueObject): boolean;
}