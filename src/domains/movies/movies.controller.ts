import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "@root/common/decorateros";
import { AuthBearer } from "@root/common/decorateros/auth.decorator";
import { GetMoviesFilterDTO } from "@root/common/Dto/movie.dto";
import { UserInterface } from "@root/common/interfaces/user.interface";
import { MoviesService } from "./movies.service";
@Controller("/movie")
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
    return { result, message: "Movies fetched successfully" };
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
    return { result, message: "Movies by genre fetched successfully" };
  }
  @Get("Get-Image-URL/:imgPath")
  @AuthBearer()
  @ApiParam({ name: "imgPath", required: true })
  async getImageURL(@Param("imgPath") imgPath: string) {
    const result = await this.moviesService.getImageURL(imgPath);
    return { result, message: "Image URL fetched successfully" };
  }
  @Get("Add-To-Wishlist/:movieId")
  @AuthBearer()
  @ApiParam({ name: "movieId", required: true })
  async addToWishlist(
    @Param("movieId") movieId: number,
    @UserDecorator() user: UserInterface
  ) {
    const result = await this.moviesService.addToWishlist(movieId, user);
    return { result, message: "Movie added to wishlist successfully" };
  }
  @Get("Remove-From-Wishlist/:movieId")
  @AuthBearer()
  @ApiParam({ name: "movieId", required: true })
  async removeFromWishlist(
    @Param("movieId") movieId: number,
    @UserDecorator() user: UserInterface
  ) {
    const result = await this.moviesService.removeFromWishlist(movieId, user);
    return { result, message: "Movie removed from wishlist successfully" };
  }
  @Get("Mark-Move-Favorite/:movieId")
  @AuthBearer()
  @ApiParam({ name: "movieId", required: true })
  async markMovieFavorite(
    @Param("movieId") movieId: number,
    @UserDecorator() user: UserInterface
  ) {
    const result = await this.moviesService.markMovieFavorite(movieId, user);
    return { result, message: "Movie marked as favorite successfully" };
  }
  @Get("My-Wishlist/:skip/:take")
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
  async getMyWishlist(
    @Param("skip") skip: number,
    @Param("take") take: number,
    @UserDecorator() user: UserInterface
  ) {
    const result = await this.moviesService.getMyWishlist(user, skip, take);
    return { result, message: "My wishlist fetched successfully" };
  }
}
