import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {AddUserInfoParam, QueryListParam, SysUserDetail} from "@/pages/system/UserManager/data";


export async function getPageUserList(data: QueryListParam) {
  return request<ResponseData<PageResponse<SysUserDetail>>>(`/api/authorization/sysUser/pageGetUserInfo`, {
    method: 'POST',
    data
  });
}

export async function sendServerToDelUserInfo(userId: string) {
  return request<ResponseData<PageResponse<SysUserDetail>>>(`/api/authorization/sysUser/delUser?userId=${userId}`);
}

export async function addUserInfoToServer(data: AddUserInfoParam) {
  return request<ResponseData<PageResponse<any>>>(`/api/authorization/sysUser/addUser`, {
    method: 'POST',
    data
  });
}

export async function changeServerUserStauts(type: 'freeze'|'deny'|'unFreeze'|'unDeny', userId: string) {
  return request<ResponseData<PageResponse<any>>>(`/api/authorization/sysUser/updateUserStatus?type=${type}&userId=${userId}`);
}
