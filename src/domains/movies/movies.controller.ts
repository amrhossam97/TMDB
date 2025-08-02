import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { AuthBearer } from "@root/common/decorateros/auth.decorator";
import { GetMoviesFilterDTO } from "@root/common/Dto/movie.dto";
@Controller()
@ApiTags("Movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post("Get-Movies/:skip/:take")
  @ApiParam({
    name: "skip",
    required: true,
    description: "Number of records to skip",
  })
  @ApiParam({
    name: "take",
    required: true,
    description: "Number of records to take",
  })
  @AuthBearer()
  async getMovies(
    @Body() body: GetMoviesFilterDTO,
    @Param("skip") skip: number,
    @Param("take") take: number
  ) {
    const result = await this.moviesService.getMovies(body, skip, take);
    return { result };
  }
  @Post("Get-Movies-By-Genre/:genreId/:skip/:take")
  @ApiParam({
    name: "genreId",
    required: true,
    description: "Id of Genre",
  })
  @ApiParam({
    name: "skip",
    required: true,
    description: "Number of records to skip",
  })
  @ApiParam({
    name: "take",
    required: true,
    description: "Number of records to take",
  })
  @AuthBearer()
  async getMoviesByGenre(
    @Body() body: GetMoviesFilterDTO,
    @Param("genreId") genreId: number,
    @Param("skip") skip: number,
    @Param("take") take: number
  ) {
    const result = await this.moviesService.getMoviesByGenre(
      body,
      genreId,
      skip,
      take
    );
    return { result };
  }
  @Get("Get-Image-URL/:imgPath")
  @AuthBearer()
  @ApiParam({ name: "imgPath", required: true })
  async getImageURL(@Param("imgPath") imgPath: string) {
    const result = await this.moviesService.getImageURL(imgPath);
    return { result };
  }
}
