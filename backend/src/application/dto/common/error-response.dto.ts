import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ErrorResponseDto {
  @ApiProperty({
    description: "HTTP status code",
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: "Error message",
    example: "Validation failed",
  })
  message: string;

  @ApiProperty({
    description: "Error type",
    example: "BadRequest",
  })
  error: string;

  @ApiProperty({
    description: "Timestamp of the error",
    example: "2024-01-15T10:30:00.000Z",
  })
  timestamp: string;

  @ApiProperty({
    description: "Request path",
    example: "/api/v1/auth/register",
  })
  path: string;

  @ApiPropertyOptional({
    description: "Detailed validation errors (if applicable)",
    example: [
      {
        field: "email",
        message: "Email must be a valid email address",
        value: "invalid-email",
      },
    ],
  })
  details?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: "Validation errors",
    example: [
      {
        field: "email",
        message: "Email must be a valid email address",
        value: "invalid-email",
      },
      {
        field: "password",
        message: "Password must be at least 8 characters long",
        value: "123",
      },
    ],
  })
  details: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}
