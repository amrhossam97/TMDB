import { Controller, Get } from "@nestjs/common";
import { AuthBearer } from "@root/common/decorateros/auth.decorator";
import { GenresService } from "./genres.service";
@Controller("/genres")
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get("/list")
  @AuthBearer()
  async getGenres() {
    const result = await this.genresService.getGenres();
    return { result, message: "Genres fetched successfully" };
  }
}
