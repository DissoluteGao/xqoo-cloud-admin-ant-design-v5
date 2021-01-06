import {request} from "@@/plugin-request/request";
import {ResponseData} from "@/services/PublicInterface";
import {RoleDetailInfo, SysRolePageInfo, SysRoleQuery} from "@/pages/system/RoleManager/data";


export async function getPageRoleInfo(data: SysRoleQuery) {
  return request<ResponseData<SysRolePageInfo>>(`/api/authorization/sysRole/pageGetRoleInfo`, {
    method: 'POST',
    data
  });
}

export async function getServerRoleDetail(id: number|string) {
  return request<ResponseData<RoleDetailInfo | undefined>>(`/api/authorization/sysRole/getRoleDetail?roleId=${id}`);
}

export async function removeServerRoleInfo(id: number) {
  return request<ResponseData<number | undefined>>(`/api/authorization/sysRole/removeRoleInfo?roleId=${id}`);
}

export async function updateRoleInfo(data: RoleDetailInfo) {
  return request<ResponseData<number|undefined>>(`/api/authorization/sysRole/updateRoleInfo`, {
    method: 'POST',
    data
  });
}
