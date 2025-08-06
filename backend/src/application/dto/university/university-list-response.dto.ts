import { ApiProperty } from "@nestjs/swagger";
import { UniversityResponseDto } from "./university-response.dto";

export class UniversityPaginationMetaDto {
  @ApiProperty({ description: "Current page number" })
  currentPage: number;

  @ApiProperty({ description: "Number of items per page" })
  limit: number;

  @ApiProperty({ description: "Total number of items" })
  totalItems: number;

  @ApiProperty({ description: "Total number of pages" })
  totalPages: number;

  @ApiProperty({ description: "Number of items in current page" })
  itemsInCurrentPage: number;

  @ApiProperty({ description: "Has previous page" })
  hasPreviousPage: boolean;

  @ApiProperty({ description: "Has next page" })
  hasNextPage: boolean;

  @ApiProperty({
    description: "Previous page number (if exists)",
    nullable: true,
  })
  previousPage: number | null;

  @ApiProperty({ description: "Next page number (if exists)", nullable: true })
  nextPage: number | null;
}

export class UniversityListResponseDto {
  @ApiProperty({
    description: "List of universities",
    type: [UniversityResponseDto],
  })
  universities: UniversityResponseDto[];

  @ApiProperty({ description: "Pagination information" })
  pagination: UniversityPaginationMetaDto;
}
