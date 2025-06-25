import { Error } from "../../libs/result-pattern";
import { BaseResponse } from "./base.response";

export class ProblemResponse extends BaseResponse{
  constructor(
    public readonly error: Error,
    isSuccess: boolean = false,
    traceId?: string,
  ) {
    super(isSuccess, traceId);
  }
}
{
  
}