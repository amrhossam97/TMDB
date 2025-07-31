import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UserLoginDto {
  @ApiProperty({ name: "phone", type: "string", example: "+201095047883" })
  @IsPhoneNumber('SA')
  phone: string;

  @ApiProperty({ format: "password", example: "amr@1234" })
  @IsString()
  password?: string;
}
export class RegisterDto {
  @ApiProperty({ name: "phoneNumber", type: "string", example: "+201095047883" })
  @IsPhoneNumber('SA')
  phoneNumber: string;

  @ApiProperty({ required: true, format: "password", example: "amr@1234" })
  @IsString({ message: "كلمة المرور مطلوبة" })
  password: string;

  @ApiProperty({ example: "amr hossam" })
  @IsString()
  userName: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  cityId:number;

  @ApiProperty({ example: "Abc12345" })
  @IsString()
  @IsOptional()
  friend_code: string;
}
export class ForgetPasswordDTO {
  @ApiProperty({ type: "string", example: "+201095047883" })
  @IsPhoneNumber('SA')
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
  userName:string;

  @ApiProperty({ name: "phone", type: "string", example: "+201095047883" })
  @IsPhoneNumber('SA')
  @IsOptional()
  phoneNumber: string;
}
