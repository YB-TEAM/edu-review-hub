import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { IAuthService } from "@/application/services/auth.service.interface";
import { RegisterDto } from "@/application/dto/auth/register.dto";
import { LoginDto } from "@/application/dto/auth/login.dto";
import { RefreshTokenDto } from "@/application/dto/auth/refresh-token.dto";
import { LogoutDto } from "@/application/dto/auth/logout.dto";
import { AuthResponseDto } from "@/application/dto/auth/auth-response.dto";
import { LocalAuthGuard } from "@/presentation/guards/local-auth.guard";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject("IAuthService") private readonly authService: IAuthService
  ) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: "Email or username already exists",
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials",
  })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh access token" })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid refresh token",
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken, refreshTokenDto.deviceId);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout user" })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({
    status: 200,
    description: "Logout successful",
  })
  async logout(@Request() req, @Body() logoutDto: LogoutDto): Promise<void> {
    return this.authService.logout(req.user.id, logoutDto.deviceId);
  }
}
