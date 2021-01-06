import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {DataSourceInfo, DataSourceType, QueryDataSourceInfo} from "@/pages/code/DataSource/data";

export async function getDataSourceInfo(data: QueryDataSourceInfo) {
  return request<ResponseData<PageResponse<DataSourceInfo>>>(`/api/codeGen/handleCenter/pageGetDataSourceInfo`, {
    method: 'POST',
    data
  });
}

export async function getDataBaseType() {
  return request<ResponseData<DataSourceType[]>>(`/api/codeGen/handleCenter/getDataBaseType`);
}

export async function deleteDataSource(id: number) {
  return request<ResponseData<any>>(`/api/codeGen/handleCenter/deleteDataSource?id=${id}`);
}

export async function updateDataSource(data: DataSourceInfo) {
  return request<ResponseData<any>>(`/api/codeGen/handleCenter/updateDataSource`, {
    method: 'POST',
    data
  });
}

export async function testConnect(data: DataSourceInfo, type: string) {
  return request<ResponseData<any>>(`/api/codeGen/testConnect/testDataBaseConnect?type=${type}`, {
    method: 'POST',
    data
  });
}
