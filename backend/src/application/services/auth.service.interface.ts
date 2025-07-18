import { RegisterDto } from "../dto/auth/register.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { AuthResponseDto } from "../dto/auth/auth-response.dto";

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<AuthResponseDto>;
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
  refreshToken(refreshToken: string, deviceId?: string): Promise<AuthResponseDto>;
  logout(userId: number, deviceId?: string): Promise<void>;
  validateUser(identifier: string, password: string): Promise<any>;
}
