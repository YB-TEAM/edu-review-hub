export class UniversityResponseDto {
  id: number;
  name: string;
  location?: string[];
  description?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}
