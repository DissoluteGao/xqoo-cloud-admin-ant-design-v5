import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {getOperationLogParam, OperationLog, QueryOperationLog} from "@/pages/devOps/OperationLog/data";


export async function getOperationLog(data: QueryOperationLog) {
  return request<ResponseData<PageResponse<OperationLog>>>(`/api/operLog/operLog/getPageOperationLog`, {
    method: 'POST',
    data
  });
}

export async function getOperationLogData(logId: string, type: 'request'|'response') {
  return request<ResponseData<getOperationLogParam>>(`/api/operLog/operLog/getOperationData?logId=${logId}&type=${type}`);
}
