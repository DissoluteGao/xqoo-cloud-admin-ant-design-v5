import {request} from "@@/plugin-request/request";
import {PageRequest, ResponseData} from "@/services/PublicInterface";
import {AddUserRoleInfo, SysUserRoleDetail, UserNoRoleInfo} from "@/pages/system/UserRole/data";

export async function getUserRoleListByUserId(userId: string) {
  return request<ResponseData<SysUserRoleDetail>>(`/api/authorization/sysUserRole/getUserRoleListByUserId?userId=${userId}`);
}

export async function getUserNoRoleListByUserId(userId: string, data: PageRequest) {
  return request<ResponseData<UserNoRoleInfo>>(`/api/authorization/sysUserRole/getUserNoRoles?userId=${userId}`, {
    method: 'POST',
    data
  });
}

export async function deleteUserRole(data: number[], userId: string) {
  return request<ResponseData<any>>(`/api/authorization/sysUserRole/deleteUserRole?userId=${userId}`, {
    method: 'POST',
    data
  });
}

export async function addUserRole(data: AddUserRoleInfo) {
  return request<ResponseData<any>>(`/api/authorization/sysUserRole/addUserRole`, {
    method: 'POST',
    data
  });
}
