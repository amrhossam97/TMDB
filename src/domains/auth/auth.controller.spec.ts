import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserLoginDto, RegisterDto, ForgetPasswordDTO } from '@root/common/Dto/user.dto';
import { ConfirmChangePasswordDTO } from '@root/common/Dto/change-password.dto';
import { ResendCodeDTO, VerifyDTO } from '@root/common/Dto/verify.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'token' }),
    signUp: jest.fn().mockResolvedValue({ id: 1 }),
    confirmVerify: jest.fn().mockResolvedValue(true),
    confirmChangePass: jest.fn().mockResolvedValue(true),
    resendSMS: jest.fn().mockResolvedValue(true),
    forgetPassword: jest.fn().mockResolvedValue(1),
    logout: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should return success message', async () => {
    const body: UserLoginDto = { phone: 'x', password: 'y' };
    const result = await controller.login(body);
    expect(result).toEqual({ message: 'Login Successful', result: { access_token: 'token' } });
    expect(service.login).toHaveBeenCalledWith(body);
  });

  it('register should return success message', async () => {
    const body: RegisterDto = { phoneNumber: 'x', password: 'y', userName: 'amr' };
    const result = await controller.register(body);
    expect(result).toEqual({ message: 'Registration Successful', result: { id: 1 } });
    expect(service.signUp).toHaveBeenCalledWith(body);
  });

  it('confirmVerify should return success message', async () => {
    const body: VerifyDTO = { userId: 1, code: 1234 };
    const result = await controller.confirmVerify(body);
    expect(result).toEqual({ message: 'Verification Successful', result: true });
    expect(service.confirmVerify).toHaveBeenCalledWith(body);
  });

  it('confirmChangePass should return success message', async () => {
    const body: ConfirmChangePasswordDTO = { userId: 1, password: 'pass', code: 1234 };
    const result = await controller.confirmChangePass(body);
    expect(result).toEqual({ message: 'Password Changed Successfully', result: true });
    expect(service.confirmChangePass).toHaveBeenCalledWith(body);
  });

  it('resendSMS should return success message', async () => {
    const body: ResendCodeDTO = { userId: 1, type: 'Verify' };
    const result = await controller.resendSMS(body);
    expect(result).toEqual({ message: 'Code Sent Successfully' });
    expect(service.resendSMS).toHaveBeenCalledWith(body);
  });

  it('forgetPassword should return success message', async () => {
    const body: ForgetPasswordDTO = { phone: 'x' };
    const result = await controller.forgetPassword(body);
    expect(result).toEqual({ message: 'Code Sent Successfully', result: 1 });
    expect(service.forgetPassword).toHaveBeenCalledWith(body.phone);
  });

  it('Logout should return success message', async () => {
    const user = { id: 1 };
    const result = await controller.Logout(user);
    expect(result).toEqual({ message: 'Logout Successful', result: true });
  });
});
