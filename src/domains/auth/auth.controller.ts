import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "@root/common/decorateros";
import { AuthBearer } from "@root/common/decorateros/auth.decorator";
import {
  ForgetPasswordDTO,
  RegisterDto,
  UserLoginDto,
} from "@root/common/Dto/user.dto";
import {
  ResendCodeDTO,
  ReVerifyDTO,
  VerifyDTO,
} from "@root/common/Dto/verify.dto";
import { AuthService } from "./auth.service";
import { ConfirmChangePasswordDTO } from "@root/common/Dto/change-password.dto";
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags("Auth")
  @ApiOperation({
    description: "The user should be able to login if the account is verified",
  })
  @Post("/login")
  async login(@Body() body: UserLoginDto) {
    const result = await this.authService.login(body);
    return { message: "Login Successful", result };
  }

  @Post("/register")
  @ApiTags("Auth")
  async register(@Body() body: RegisterDto) {
    const result = await this.authService.signUp(body);
    return { message: "Registration Successful", result };
  }
  @Post("/confirm-verify")
  @ApiTags("Auth")
  async confirmVerify(@Body() body: VerifyDTO) {
    const result = await this.authService.confirmVerify(body);
    return { message: "Verification Successful", result };
  }
  @Post("/confirm-change-password")
  @ApiTags("Auth")
  async confirmChangePass(@Body() body: ConfirmChangePasswordDTO) {
    console.log({ body });

    const result = await this.authService.confirmChangePass(body);
    return { message: "Password Changed Successfully", result };
  }

  @Post("/resendSMS")
  @ApiTags("Auth")
  @ApiOperation({ description: "Resend verify code or forget code to user's." })
  async resendSMS(@Body() body: ResendCodeDTO) {
    await this.authService.resendSMS(body);
    return { message: "Code Sent Successfully" };
  }

  @Post("/forgetPassword")
  @ApiTags("Auth")
  @ApiOperation({
    description:
      "Send Code to user’s email or phone to be able to change his password.",
  })
  async forgetPassword(@Body() body: ForgetPasswordDTO) {
    let result = await this.authService.forgetPassword(body.phone);
    return { message: "Code Sent Successfully", result };
  }

  @ApiTags("Auth")
  @Get("/logOut")
  @ApiOperation({ description: "The user should be able to logout." })
  @AuthBearer()
  async Logout(@UserDecorator() user) {
    let result = await this.authService.logout(user.id);
    return { message: "Logout Successful", result };
  }
}
