import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class VerifyDTO{

    @ApiProperty({example: 1})
    @IsNumber()
    userId:number;
    
    @ApiProperty({example: 3333})
    @IsNumber()
    code:number;

}
export class ReVerifyDTO{
    @ApiProperty({example: '+201095047883'})
    @IsPhoneNumber()
    phone:string;
}
export class AddRegisterationTokenDTO{
    @ApiProperty({ name: 'registration_token', type: 'string' , example: "string"})
    @IsString()
    @IsOptional()
    registration_token: string;
}
export class VerifyPhoneNumber{
    @ApiProperty({example: 3333})
    @IsNumber()
    code:number;

}
export class ResendCodeDTO{
    @ApiProperty({example: 1})
    @IsNumber()
    userId:number;

    @ApiProperty({example: 'Forget || Verify'})
    @IsString()
    type:string;
}