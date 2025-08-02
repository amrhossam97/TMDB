import { Controller } from "@nestjs/common";
import { GenresService } from "./genres.service";
@Controller()
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

}
