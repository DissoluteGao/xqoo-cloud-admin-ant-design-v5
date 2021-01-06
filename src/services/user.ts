import { request } from 'umi';
import {getLocalStorage, removeLocalStorage, setLocalStorage} from '@/utils/utils';
import {MenuDataItem} from "@@/plugin-layout/runtime";
import {ResponseData} from "@/services/PublicInterface";

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
// 获取当前用户的菜单权限
export async function getUserRoutes(){
  return request<ResponseData<MenuDataItem[]>>('/api/authorization/resource/consoleMenu', );
}

// 获取当前缓存中登录用户
export async function getCacheCurrentUser(): Promise<any> {
  const obj = getLocalStorage('current', 'json');
  if (obj && typeof obj === 'object') {
    return obj;
  }
  return undefined;
}

// 设置当前用户信息到缓存中
export async function setCacheCurrentUser(obj: API.CurrentUser): Promise<void> {
  return setLocalStorage('current', obj, 'json');
}
// 清除当前缓存信息
export const removeCacheCurrentUser = async (key: string): Promise<void> => {
  removeLocalStorage(key);
}
