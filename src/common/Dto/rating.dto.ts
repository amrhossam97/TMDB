import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class AddRateDTO {
  @ApiProperty({ example: 1, description: "Movie ID" })
  @IsNumber()
  movieId: number;

  @ApiProperty({ example: 4.5, description: "Rating score" })
  @IsNumber()
  @Max(5, { message: "Score must be between 0 and 5" })
  @Min(0, { message: "Score must be between 0 and 5" })
  score: number;

  @ApiProperty({
    example: "Great movie!",
    description: "Comment about the movie",
  })
  @IsString()
  @IsOptional()
  comment: string;
}
