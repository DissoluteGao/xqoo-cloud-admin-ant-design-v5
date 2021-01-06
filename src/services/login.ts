import { request } from 'umi';
import {ResponseData} from "@/services/PublicInterface";

export enum LoginSourceEnum {
  PcBrowser = 'PcBrowser',
  PcClient = 'PcClient',
  APP = 'APP',
  WeChat = 'WeChat',
  SmallProgram = 'SmallProgram',
  UnKnow = 'UnKnow',
}

export enum LoginTypeEnum {
  // 账号密码模式
  PASSWORD = 'PASSWORD',
  // 扫码登录
  QRCODE = 'QRCODE',
  // 手机号登录
  PHONE = 'PHONE',
  // 邮箱登录
  EMAIL = 'EMAIL',
  // 指纹识别登录
  FINGER = 'FINGER',
  // 面部识别登录
  FACE = 'FACE',
  // 证件扫描登录
  IDENTIFY = 'IDENTIFY',
  // 第三方登录
  THIRDPARTY = 'THIRDPARTY',
}

export interface LoginParamsType {
  loginId: string;
  loginSource: LoginSourceEnum;
  loginType: string;
  password: string;
  randomStr: string;
  errorCode: string;
}

// 登录接口
export async function passwordLogin(params: LoginParamsType): Promise<API.LoginStateType> {
  return request<ResponseData<API.CurrentUser>>('/api/authorization/author/loginByPwd', {
    method: 'GET',
    params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// 登出接口
export async function outLogin() {
  return request<API.ResponseEntity>('/api/authorization/author/loginOut');
}
