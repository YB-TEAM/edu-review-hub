import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserSessionRepository } from "@/infrastructure/database/repositories/user-session.repository";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly userSessionRepository: UserSessionRepository) {
    super();
  }

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    // Check if session is still active
    const session = await this.userSessionRepository.findBySessionToken(token);
    if (!session || !session.isActive) {
      throw new UnauthorizedException("Session has been invalidated");
    }

    // Continue with normal JWT validation
    const result = await super.canActivate(context);
    return result as boolean;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
