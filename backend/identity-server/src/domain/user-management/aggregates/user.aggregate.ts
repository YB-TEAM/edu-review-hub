import { Aggregate } from "../../common/primitives/aggregate";
import { UserStatusEnum } from "../../profile-management/enums/user-status.enum";
import { Email } from "../value-objects/email.value-object";
import { HashPassword } from "../value-objects/hasspassword.value-object";

export class User extends Aggregate{
  private readonly _id: string;
  private readonly _email: Email;
  private readonly _hashPassword: HashPassword;
  private readonly _status: UserStatusEnum;

  constructor(user: User){
    super();
    this._id = user.id;
    this._email = user.email;
    this._hashPassword = user.hashPassword;
    this._status = user.status;
  }

  get id(): string {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get hashPassword(): HashPassword {
    return this._hashPassword;
  }

  get status(): UserStatusEnum {
    return this._status;
  }
}