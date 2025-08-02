# 🔐 Auth Domain

## Controllers
- **AuthController**
  - `/auth/login` : User login
  - `/auth/register` : User registration
  - `/auth/confirm-verify` : Confirm verification code
  - `/auth/confirm-change-password` : Change password
  - `/auth/forget-password` : Forget password
  - `/auth/resend-sms` : Resend verification SMS
  - `/auth/logout` : Logout

## Services
- **AuthService**
  - `validateUser(phone, password)`
  - `login(body)`
  - `signUp(body)`
  - `confirmVerify(body)`
  - `confirmChangePass(body)`
  - `forgetPassword(phoneNumber)`
  - `resendSMS(body)`
  - `logout(id)`