import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class MovieDto {
  @ApiProperty({ example: 755898, description: "TMDB movie ID" })
  @IsNumber()
  id: number;

  @ApiProperty({ example: "War of the Worlds" })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      "Will Radford is a top cyber-security analyst for Homeland Security who tracks potential threats...",
  })
  @IsString()
  overview: string;

  @ApiProperty({ example: "2025-07-29" })
  @IsDateString()
  release_date: string;

  @ApiProperty({ example: "/iZLqwEwUViJdSkGVjePGhxYzbDb.jpg" })
  @IsString()
  backdrop_path: string;

  @ApiProperty({ example: "/yvirUYrva23IudARHn3mMGVxWqM.jpg" })
  @IsString()
  poster_path: string;

  @ApiProperty({ example: "en" })
  @IsString()
  original_language: string;

  @ApiProperty({ example: "War of the Worlds" })
  @IsString()
  original_title: string;

  @ApiProperty({ example: [878, 53] })
  @IsArray()
  @IsNumber({}, { each: true })
  genre_ids: number[];
}
export class MoviesResponseDto {
  @ApiProperty({ example: 1, description: "Current page number" })
  @IsNumber()
  page: number;

  @ApiProperty({ example: 1, description: "Total number of pages" })
  @IsNumber()
  total_pages: number;

  @ApiProperty({ example: 1, description: "Total number of results" })
  @IsNumber()
  total_results: number;

  @ValidateNested({ each: true })
  @Type(() => MovieDto)
  results: MovieDto[];
}
export class GetMoviesFilterDTO {
  @ApiProperty({
    example: "Dragon",
    description: "Search term for movie title",
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: "2025-07-29",
    description: "Search term for movie release date from",
  })
  @IsOptional()
  releaseDateFrom: Date;

  @ApiProperty({
    example: "2025-07-29",
    description: "Search term for movie release date to",
  })
  @IsOptional()
  releaseDateTo: Date;
}
