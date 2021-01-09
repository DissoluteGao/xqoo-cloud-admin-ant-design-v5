import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {
  GatewayFiltersConfig,
  GatewayPredicatesConfig,
  GatewayRouteEntity,
  GatewayRouteInfo,
  GatewayRouteQuery
} from "@/pages/devOps/GatewayRoute/data";

export async function getRouteList(data: GatewayRouteQuery, token: string) {
  return request<ResponseData<PageResponse<GatewayRouteInfo>>>(`/api/sysConsole/gatewayRoute/getRouteList?token=${token}`, {
    method: 'POST',
    data
  });
}

export async function denyClient(data: GatewayRouteQuery, token: string) {
  return request<ResponseData<string>>(`/api/sysConsole/gatewayRoute/denyClient?token=${token}`, {
    method: 'POST',
    data
  });
}

export async function resetClient(data: GatewayRouteQuery, token: string) {
  return request<ResponseData<string>>(`/api/sysConsole/gatewayRoute/resetClient?token=${token}`, {
    method: 'POST',
    data
  });
}

export async function refreshRoute(token: string) {
  return request<ResponseData<string>>(`/api/sysConsole/gatewayRoute/refresh?token=${token}`);
}

export async function getSingleRouteInfo(routeId: string, token: string) {
  return request<ResponseData<GatewayRouteEntity>>(`/api/sysConsole/gatewayRoute/getSingleRouteInfo?routeId=${routeId}&token=${token}`);
}

export async function putRouteInfo(data: GatewayRouteEntity, token: string) {
  return request<ResponseData<string>>(`/api/sysConsole/gatewayRoute/putRouteInfo?token=${token}`, {
    method: 'POST',
    data
  });
}

export async function getPredicatesList(token: string) {
  return request<ResponseData<GatewayPredicatesConfig[]>>(`/api/sysConsole/gatewayRoute/getPredicatesList?token=${token}`);
}

export async function getFiltersList(token: string) {
  return request<ResponseData<GatewayFiltersConfig[]>>(`/api/sysConsole/gatewayRoute/getFiltersList?token=${token}`);
}
