import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // If no token provided, allow request to continue without user
    if (!token) {
      return true;
    }

    try {
      // If token exists, validate it
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      // If token is invalid, continue without user (don't throw error)
      console.log(
        "Invalid JWT token, continuing without authentication:",
        error.message
      );
      return true;
    }
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error or no user, don't throw error - just return null
    // This allows the request to continue without authentication
    if (err || !user) {
      return null;
    }
    return user;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
