import {PageRequest} from "@/services/PublicInterface";
import {LoginSourceEnum, LoginTypeEnum} from "@/services/login";

export interface UserLoginHistoryQuery extends PageRequest{
  loginType?: LoginTypeEnum;
  loginSource?: LoginSourceEnum;
  userId?: string;
  loginIp?: string;
}

export interface UserLoginHistoryResult {
  id: number;
  userId: string;
  loginDate: string;
  loginIp: string;
  loginType: LoginTypeEnum;
  loginTypeName: string,
  loginEnv: string,
  loginSource: LoginSourceEnum,
  loginSourceName: string
}
