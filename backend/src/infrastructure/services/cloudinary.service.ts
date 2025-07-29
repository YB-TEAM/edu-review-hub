import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";

// Extend Express namespace for Multer types
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
      }
    }
  }
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
}

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get("CLOUDINARY_CLOUD_NAME"),
      api_key: configService.get("CLOUDINARY_API_KEY"),
      api_secret: configService.get("CLOUDINARY_API_SECRET"),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = "edu-review-hub",
    options: {
      transformation?: any;
      tags?: string[];
      resource_type?: "image" | "video" | "raw";
    } = {}
  ): Promise<CloudinaryUploadResult> {
    // Validate file
    if (!file || !file.buffer) {
      throw new BadRequestException("No file provided");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        "File size too large. Maximum size is 10MB"
      );
    }

    // Validate file type
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed"
      );
    }

    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder,
        resource_type: options.resource_type || "image",
        transformation: options.transformation || {
          quality: "auto",
          fetch_format: "auto",
        },
        tags: options.tags || [],
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(new BadRequestException("Failed to upload image"));
          }
          resolve(result as CloudinaryUploadResult);
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async updateImage(
    publicId: string,
    file: Express.Multer.File,
    options: {
      transformation?: any;
      tags?: string[];
    } = {}
  ): Promise<CloudinaryUploadResult> {
    // First delete the old image
    await this.deleteImage(publicId);

    // Then upload the new image with the same public_id
    return this.uploadImage(file, "edu-review-hub", {
      ...options,
      resource_type: "image",
    });
  }

  async deleteImage(publicId: string): Promise<boolean> {
    if (!publicId) {
      return false;
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error("Cloudinary delete error:", error);
          return reject(new BadRequestException("Failed to delete image"));
        }
        resolve(true);
      });
    });
  }

  async getImageInfo(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.api.resource(publicId, (error, result) => {
        if (error) {
          console.error("Cloudinary get info error:", error);
          return reject(new BadRequestException("Failed to get image info"));
        }
        resolve(result);
      });
    });
  }

  generateImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      secure: true,
      ...options,
    });
  }

  // Helper methods for common image sizes
  generateThumbnailUrl(publicId: string): string {
    return this.generateImageUrl(publicId, {
      width: 300,
      height: 200,
      crop: "fill",
      quality: "auto",
    });
  }

  generateMediumUrl(publicId: string): string {
    return this.generateImageUrl(publicId, {
      width: 800,
      height: 600,
      crop: "fill",
      quality: "auto",
    });
  }

  generateLargeUrl(publicId: string): string {
    return this.generateImageUrl(publicId, {
      width: 1200,
      height: 800,
      crop: "fill",
      quality: "auto",
    });
  }

  // Generate responsive URLs for different screen sizes
  generateResponsiveUrls(publicId: string): {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  } {
    return {
      thumbnail: this.generateThumbnailUrl(publicId),
      medium: this.generateMediumUrl(publicId),
      large: this.generateLargeUrl(publicId),
      original: this.generateImageUrl(publicId, { quality: "auto" }),
    };
  }
}
