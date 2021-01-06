import { request } from 'umi';
import {MenuDetailInfo, SimpleMenuInfo} from '@/pages/system/MenuManager/data';
import {ResponseData} from "@/services/PublicInterface";

export async function getSimpleMenuInfo() {
  return request<ResponseData<SimpleMenuInfo[]>>(`/api/authorization/resource/consoleMenuInfo`);
}

export async function getMenuDetailInfo(menuId: string) {
  return request<ResponseData<MenuDetailInfo>>(`/api/authorization/resource/consoleMenuDetailInfo?menuId=${menuId}`);
}

export async function getFactAndNoRedirectMenuDetailInfo() {
  return request<ResponseData<SimpleMenuInfo[]>>(`/api/authorization/resource/getFactAndNoRedirectMenuDetailInfo`);
}

export async function updateMenuDataToServer(data: MenuDetailInfo) {
  return request<ResponseData<any>>(`/api/authorization/sysMenu/updateMenu`, {
    method: 'POST',
    data
  });
}

export async function removeMenuDetailInfo(menuId: number) {
  return request<ResponseData<any>>(`/api/authorization/sysMenu/removeMenu?id=${menuId}`);
}
