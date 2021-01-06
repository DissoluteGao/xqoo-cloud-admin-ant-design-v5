import {LoginTypeEnum} from "@/services/login";


export interface AuthLoginConfigProperties {
  jwtSecretKey: string;
  jwtExpire: number;
  tokenExpire: number;
  tokenRefreshLimit: number;
  loginSingle: true;
  loginSingleType: "all" | "source";
  timeZoneCheck: boolean;
  timeExact: number;
  loginTypeSwitch: LoginTypeSwitch[];
  loginErrLock: LoginErrLock;
}

export interface LoginErrLock {
  active: boolean,
  maxErrorTime: number,
  lockTime: number,
  needCheckErrorTime: number,
  errorCodeExpire: number,
  notActive: boolean
}

export interface LoginTypeSwitch {
  type: LoginTypeEnum;
  active: boolean;
}
