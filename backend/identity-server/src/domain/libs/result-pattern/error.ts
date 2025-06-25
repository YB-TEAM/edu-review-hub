import { ErrorType } from "./error-type";

export class Error
{
    private constructor(
      public readonly code: string,
      public readonly description: string,
      public readonly errorType: ErrorType,
      public readonly stack?: string
    )
    {}


    public static Failure(code: string, description: string, stack?: string){
      return new this(code, description, ErrorType.Failure, stack);
    }

    public static NotFound(code: string, description: string, stack?: string){
      return new this(code, description, ErrorType.NotFound, stack);
    }

    public static Validation(code: string, description: string, stack?: string){
      return new this(code, description, ErrorType.Validation, stack);
    }

    public static Conflict(code: string, description: string, stack?: string){
      return new this(code, description, ErrorType.Conflict, stack);
    }

    public static AccessUnAuthorized(code: string, description: string, stack?: string){
      return new this(code, description, ErrorType.AccessUnAuthorized, stack);
    }

    public static AccessForbidden(code: string, description: string, stack?: string){
      return new this(code, description, ErrorType.AccessForbidden, stack);
    }
}

