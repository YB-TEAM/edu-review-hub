import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpStatus,
  HttpCode,
  Inject,
  Request,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { IUploadService } from "@/application/services/upload.service.interface";
import { UploadImageResponseDto } from "@/application/dto/upload/upload-image.dto";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { PermissionGuard } from "@/presentation/guards/permission.guard";
import { Roles } from "@/presentation/decorators/roles.decorator";
import { RequirePermissions } from "@/presentation/decorators/permissions.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";

@ApiTags("Upload")
@Controller("upload")
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth("JWT-auth")
export class UploadController {
  constructor(
    @Inject("IUploadService")
    private readonly uploadService: IUploadService
  ) {}

  @Post("image")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({
    summary: "Upload image",
    description: "Upload an image to Cloudinary and return image details",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
          description: "Image file to upload (JPEG, PNG, GIF, WebP, max 10MB)",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Image uploaded successfully",
    type: UploadImageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid file or file too large",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @Roles(
    UserRole.STUDENT,
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.UNIVERSITY_REP,
    UserRole.SUPER_ADMIN
  )
  @RequirePermissions("upload:create")
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      })
    )
    file: Express.Multer.File,
    @Request() req: any
  ): Promise<UploadImageResponseDto> {
    return await this.uploadService.uploadImage(
      file,
      "edu-review-hub",
      req.user?.id
    );
  }

  @Put("image/:publicId")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({
    summary: "Update image",
    description: "Update an existing image on Cloudinary",
  })
  @ApiConsumes("multipart/form-data")
  @ApiParam({
    name: "publicId",
    description: "Cloudinary public ID of the image to update",
    example: "edu-review-hub/abc123",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
          description: "New image file (JPEG, PNG, GIF, WebP, max 10MB)",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Image updated successfully",
    type: UploadImageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid file or file too large",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "Image not found",
  })
  @Roles(
    UserRole.STUDENT,
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.UNIVERSITY_REP,
    UserRole.SUPER_ADMIN
  )
  @RequirePermissions("upload:update")
  async updateImage(
    @Param("publicId") publicId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      })
    )
    file: Express.Multer.File,
    @Request() req: any
  ): Promise<UploadImageResponseDto> {
    return await this.uploadService.updateImage(publicId, file, req.user?.id);
  }

  @Delete("image/:publicId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete image",
    description: "Delete an image from Cloudinary",
  })
  @ApiParam({
    name: "publicId",
    description: "Cloudinary public ID of the image to delete",
    example: "edu-review-hub/abc123",
  })
  @ApiResponse({
    status: 204,
    description: "Image deleted successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "Image not found",
  })
  @Roles(
    UserRole.STUDENT,
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.UNIVERSITY_REP,
    UserRole.SUPER_ADMIN
  )
  @RequirePermissions("upload:delete")
  async deleteImage(
    @Param("publicId") publicId: string,
    @Request() req: any
  ): Promise<void> {
    await this.uploadService.deleteImage(publicId, req.user?.id);
  }

  @Get("files")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get uploaded files",
    description: "Get list of uploaded files for the current user",
  })
  @ApiResponse({
    status: 200,
    description: "Files retrieved successfully",
    type: [UploadImageResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @Roles(
    UserRole.STUDENT,
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.UNIVERSITY_REP,
    UserRole.SUPER_ADMIN
  )
  @RequirePermissions("upload:read")
  async getFiles(@Request() req: any): Promise<UploadImageResponseDto[]> {
    return await this.uploadService.getFiles(req.user?.id);
  }
}
