export class BlogResponseDto {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
