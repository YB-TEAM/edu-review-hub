import { RegisterDtoWithIp } from "../dto/auth/register.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { AuthResponseDto } from "../dto/auth/auth-response.dto";
import { RegisterResponseDto } from "../dto/auth/register-response.dto";

export interface IAuthService {
  register(registerDto: RegisterDtoWithIp): Promise<RegisterResponseDto>;
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
  refreshToken(
    refreshToken: string,
    deviceId?: string
  ): Promise<AuthResponseDto>;
  logout(userId: number, sessionToken?: string): Promise<void>;
  validateUser(identifier: string, password: string): Promise<any>;
}
