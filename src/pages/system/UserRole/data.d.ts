import {SysRoleInfo} from "@/pages/system/RoleManager/data";
import {PageResponse} from "@/services/PublicInterface";

export interface UserListDataInterface {
  userName: string;
  userId: string;
  roleCount: number;
  createDate: string;
  lastLoginTime?: string;
  checked: boolean,
}

export interface UserOnlined {
  onlined: boolean;
  onlinedType: string[];
}

export interface SysUserRoleInfo {
  id: number;
  userId: string;
  roleId: number;
  roleName: string;
  roleKey: string;
  admin: boolean;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  remarkTips?: string;
  checked: boolean;
}

export interface SysUserRoleDetail {
  onlined: UserOnlined;
  admin: boolean;
  userRoleList: SysUserRoleInfo[];
}

export interface AddUserRoleInfo {
  userId: string;
  roleId: number[];
}

export interface UserNoRoleInfo {
  admin: boolean;
  result: PageResponse<SysRoleInfo>;
}
