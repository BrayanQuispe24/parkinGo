import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { RegisterAuthAction } from '../actions/register-auth.action.js';
import { LoginAuthAction } from '../actions/login-auth.action.js';
import { VerifyOtpAuthAction } from '../actions/verify-otp-auth.action.js';
import { ResendOtpAuthAction } from '../actions/resend-otp-auth.action.js';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: RegisterAuthAction, useValue: {} },
        { provide: LoginAuthAction, useValue: {} },
        { provide: VerifyOtpAuthAction, useValue: {} },
        { provide: ResendOtpAuthAction, useValue: {} },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

