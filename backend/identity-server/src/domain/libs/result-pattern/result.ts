import { Error } from "./error";

// common/result/result.ts
export class Result<T> {
  private constructor(
    public readonly success: boolean,
    public readonly data: T | null,
    public readonly error: Error
  ) {}

  static ok<U>(data: U): Result<U> {
    return new this(true, data, null);
  }

  static fail<U = null>(error: Error): Result<U> {
    return new this(false, null, error);
  }

  match<R>(onSuccess: (data: T) => R, onFail: (error: Result<null>) => R): R {
    return this.success 
      ? onSuccess(this.data as T)
      : onFail(Result.fail(this.error));
  }
}
