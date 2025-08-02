import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfirmChangePasswordDTO } from "@root/common/Dto/change-password.dto";
import { RegisterDto, UserLoginDto } from "@root/common/Dto/user.dto";
import { ResendCodeDTO, VerifyDTO } from "@root/common/Dto/verify.dto";
import { Encript } from "@root/common/encription/encription";
import { HandleErrorMessage } from "@root/common/exceptions/error-filter";
import { Repository } from "typeorm";
import { User } from "../../database/entity/users.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private httpService: HttpService
  ) {}

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { phoneNumber: phone } });

    if (!user) {
      throw new BadRequestException("User Not Found");
    }
    const validPassword = await User.validatePassword(password, user.password);

    if (user && validPassword) {
      const { password, ...result } = user;
      return result;
    }
    return false;
  }
  async logout(id: number) {
    try {
      let user = await this.userRepo.findOne({ where: { id } });
      if (user === null) throw new BadRequestException("User Not Found");
      user.access_token = null;
      await this.userRepo.save(user);
      return true;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async login(body: UserLoginDto) {
    try {
      let user: User;
      user = await this.validateUser(body.phone, body.password);
      if (!user) {
        throw new BadRequestException("Login Failed");
      }

      if (user.isSuspended) {
        throw new BadRequestException("Account Suspended");
      }

      if (user.isverify == false) {
        throw new BadRequestException("Account Not Verified");
      }
      if (user.isDeleted == true) {
        throw new BadRequestException("Account Deleted");
      }

      // #Encrypt
      const iv = process.env.ENCRIPT_IV;
      const password = process.env.ENCRIPT_KEY;
      console.log({iv, password});
      
      const payload = {
        userName: Encript(user.userName, password, iv),
        userPhone: Encript(user.phoneNumber, password, iv),
        userId: Encript(user.id + "", password, iv),
      };
      const access_token = this.jwtService.sign(payload);
      user.access_token = access_token;
      await this.userRepo.update(user.id, user);
      return {
        access_token,
        userId: user.id,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
      };
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async confirmVerify(body: VerifyDTO) {
    try {
      let user = await this.userRepo.findOne({ where: { id: body.userId } });
      if (!user) throw new NotFoundException("User Not Found");
      if (user.smscode != body.code)
        throw new BadRequestException("Wrong Code");
      user.isverify = true;
      user.smscode = null;
      await this.userRepo.update(user.id, user);
      return true;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async signUp(body: RegisterDto) {
    try {
      await User.checkPassword(body.password);
      let foundUser = await this.userRepo.findOne({
        where: { phoneNumber: body.phoneNumber },
      });
      if (foundUser)
        throw new BadRequestException("Phone Number Already Exists");
      let user = User.toEntity(body);
      if (process.env.MODE_APP != "production") user.smscode = 3333;
      else {
        user.smscode = Math.floor(1000 + Math.random() * 9000);
        // Send SMS Or Email For Verification
      }
      user.password = await User.hashPassword(body.password);
      let newUser = await this.userRepo.save(user);
      return { id: newUser.id };
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async confirmChangePass(body: ConfirmChangePasswordDTO) {
    try {
      let user = await this.userRepo.findOne({ where: { id: body.userId } });
      if (!user) throw new NotFoundException("User Not Found");
      await User.checkPassword(body.password);

      if (user.reset_code != body.code)
        throw new BadRequestException("Wrong Code");
      user.reset_code = null;
      user.password = await User.hashPassword(body.password);
      await this.userRepo.update(user.id, user);
      return true;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async forgetPassword(phoneNumber: string) {
    try {
      let user = await this.userRepo.findOne({ where: { phoneNumber } });
      if (user === null) throw new BadRequestException("User Not Found");
      if (!user.isverify) throw new BadRequestException("User Not Verified");

      if (process.env.MODE_APP != "production") user.reset_code = 3333;
      else {
        user.reset_code = Math.floor(1000 + Math.random() * 9000);
        // Send SMS Or Email For Reset Password
      }
      await this.userRepo.update(user.id, user);
      return user.id;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async resendSMS(body: ResendCodeDTO) {
    try {
      let user = await this.userRepo.findOne({ where: { id: body.userId } });
      if (!user) throw new BadRequestException("User Not Found");
      if (body.type == "Forget") await this.forgetPassword(user.phoneNumber);
      else if (body.type == "Verify") {
        if (user.isverify == true)
          throw new BadRequestException("User Already Verified");
        if (process.env.MODE_APP != "production") user.smscode = 3333;
        else {
          user.smscode = Math.floor(1000 + Math.random() * 9000);
          // Send SMS Or Email For Verification
        }
        await this.userRepo.update(user.id, user);
      } else throw new BadRequestException("Invalid Type");
      return user.id;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
}
