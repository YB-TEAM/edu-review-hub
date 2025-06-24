export abstract class Entity{
  protected readonly _id: string;
  constructor(id: string) {
    this._id = id;
  }

  equals(entity: Entity): boolean {
    return this._id === entity._id;
  }
}
