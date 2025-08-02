import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@root/database/entity/users.entity';
import { HttpService } from '@nestjs/axios';
import { UserLoginDto, RegisterDto, ForgetPasswordDTO } from '@root/common/Dto/user.dto';
import { ConfirmChangePasswordDTO } from '@root/common/Dto/change-password.dto';
import { ResendCodeDTO, VerifyDTO } from '@root/common/Dto/verify.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo, jwtService, httpService;

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    jwtService = { sign: jest.fn().mockReturnValue('token') };
    httpService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: JwtService, useValue: jwtService },
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw BadRequestException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(undefined);
      await expect(service.validateUser('phone', 'pass')).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should throw BadRequestException if user not found', async () => {
      service.validateUser = jest.fn().mockResolvedValue(false);
      await expect(service.login({ phone: 'x', password: 'y' } as UserLoginDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('signUp', () => {
    it('should throw BadRequestException if phone exists', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1 });
      await expect(service.signUp({ phoneNumber: 'x', password: 'y', userName: 'amr' } as RegisterDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('confirmVerify', () => {
    it('should throw NotFoundException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(undefined);
      await expect(service.confirmVerify({ userId: 1, code: 1234 } as VerifyDTO)).rejects.toThrow(NotFoundException);
    });
  });

  describe('confirmChangePass', () => {
    it('should throw NotFoundException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(undefined);
      await expect(service.confirmChangePass({ userId: 1, password: 'pass', code: 1234 } as ConfirmChangePasswordDTO)).rejects.toThrow(NotFoundException);
    });
  });

  describe('forgetPassword', () => {
    it('should throw BadRequestException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.forgetPassword('x')).rejects.toThrow(BadRequestException);
    });
  });

  describe('resendSMS', () => {
    it('should throw BadRequestException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(undefined);
      await expect(service.resendSMS({ userId: 1, type: 'Verify' } as ResendCodeDTO)).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('should throw BadRequestException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.logout(1)).rejects.toThrow(BadRequestException);
    });
  });
});