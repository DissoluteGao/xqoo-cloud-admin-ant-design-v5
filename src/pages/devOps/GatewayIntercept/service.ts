import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {GatewayInterceptQuery, GatewayInterceptResult} from "@/pages/devOps/GatewayIntercept/data";


export async function getInterceptLogPageRecord(data: GatewayInterceptQuery) {
  return request<ResponseData<PageResponse<GatewayInterceptResult>>>(`/api/gatewayIntercept/getInterceptLogPageRecord`, {
    method: 'POST',
    data
  });
}
