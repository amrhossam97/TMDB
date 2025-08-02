import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class UserLoginDto {
  @ApiProperty({ name: "phone", type: "string", example: "+201095047883" })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ format: "password", example: "amr@1234" })
  @IsString()
  password?: string;
}
export class RegisterDto {
  @ApiProperty({
    name: "phoneNumber",
    type: "string",
    example: "+201095047883",
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ required: true, format: "password", example: "amr@1234" })
  @IsString({ message: "كلمة المرور مطلوبة" })
  password: string;

  @ApiProperty({ example: "amr hossam" })
  @IsString()
  userName: string;
}
export class ForgetPasswordDTO {
  @ApiProperty({ type: "string", example: "+201095047883" })
  @IsPhoneNumber("SA")
  phone: string;
}
export class UpdateUserPhoneDTO {
  @ApiProperty({ example: "amr@amin.com" })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ example: "amr hossam" })
  @IsString()
  @IsOptional()
  userName: string;

  @ApiProperty({ name: "phone", type: "string", example: "+201095047883" })
  @IsPhoneNumber("SA")
  @IsOptional()
  phoneNumber: string;
}
