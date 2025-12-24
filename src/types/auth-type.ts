export interface ISendOtp {
  email: string;
  name: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface IRegisterResponse {
  accessToken: string;
  isVerified: boolean;
}
