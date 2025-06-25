import { UUID } from "crypto";

export abstract class Entity{
  protected readonly _id: UUID;
  constructor(id: UUID) {
    this._id = id;
  }

  equals(entity: Entity): boolean {
    return this._id === entity._id;
  }
}
