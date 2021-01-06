import {PageRequest} from "@/services/PublicInterface";

export interface GatewayInterceptQuery extends PageRequest{
  interceptType?: 'REMOTE'|'TARGET';
  requestIp?: string;
}

export interface GatewayInterceptResult {
  id: number;
  interceptType: 'REMOTE'|'TARGET';
  interceptTypeName: "来源拦截"|"访问拦截";
  requestIp: string;
  requestPort: string;
  requestUrl: string;
  interceptTime: string
}
