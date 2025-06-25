import { BaseResponse } from "./base.response";

export class OK extends BaseResponse {
  constructor(
    public readonly data?: any,
    isSuccess: boolean = true,
    traceId?: string,
  ) {
    super(isSuccess, traceId);
  }

}