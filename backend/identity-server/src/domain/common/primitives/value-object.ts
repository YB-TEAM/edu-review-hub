export abstract class ValueObject{
  protected constructor() {
  }

  abstract equals(other: ValueObject): boolean;
}