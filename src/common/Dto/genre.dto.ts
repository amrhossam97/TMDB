import { Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";
export class GenreDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
export class GenresResponseDto {
  @ValidateNested({ each: true })
  @Type(() => GenreDto)
  genres: GenreDto[];
}
