import {PageRequest} from "@/services/PublicInterface";
import {LoginSourceEnum} from "@/services/login";

export interface QueryOperationLog extends PageRequest{
  operationStatus?: number;
  operationType?: number;
  operatorId?: string;
  operatorName?: string;
  requestMethod?: string;
  requestUrl?: string
}

export interface OperationLog {
  logId: string;
  operationStatus: number;
  operationStatusName: string;
  operationType: number;
  operationTypeName: string;
  requestMethod: string;
  methodName: string;
  requestUrl: string;
  operatorId: string;
  operatorName: string;
  operatorRemoteIp: string;
  operatorMessage?: string;
  tipsMessage: string;
  createTime: string;
  loginSource: LoginSourceEnum;
  loginSourceName: string;
  hasRequestData: boolean;
  hasResponseData: boolean
}

export interface getOperationLogParam {
  hasData: boolean;
  content: any;
}
