import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "@root/common/decorateros";
import { AuthBearer } from "@root/common/decorateros/auth.decorator";
import { AddRateDTO } from "@root/common/Dto/rating.dto";
import { UserInterface } from "@root/common/interfaces/user.interface";
import { RatingService } from "./rating.service";
@Controller("/rate")
@ApiTags("Rating")
export class RatingController {
  constructor(private readonly rateService: RatingService) {}
  @Post("Add-Rating")
  @AuthBearer()
  async addRating(
    @Body() body: AddRateDTO,
    @UserDecorator() user: UserInterface
  ) {
    const result = await this.rateService.addRating(body, user.userId);
    return { result, message: "Rating added successfully" };
  }
}
