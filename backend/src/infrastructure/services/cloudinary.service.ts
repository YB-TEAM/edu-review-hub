import { Injectable } from "@nestjs/common";
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
    folder = "uploads"
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
