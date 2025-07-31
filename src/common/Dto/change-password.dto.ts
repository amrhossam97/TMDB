import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length, Matches } from "class-validator";
export class ChangePasswordDTO {
  @ApiProperty({ required: true, format: "password", example: "amr@1234" })
  @IsString()
  newPassword: string;
}
export class ConfirmChangePasswordDTO {
  @ApiProperty({ required: true, format: "password", example: "amr@1234" })
  @IsString()
  password: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 4444 })
  @IsNumber()
  code: number;
}
