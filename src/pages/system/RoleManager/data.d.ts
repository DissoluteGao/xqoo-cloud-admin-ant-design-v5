import {PageRequest, PageResponse} from "@/services/PublicInterface";

export interface SysRoleInfo {
  id: number;
  admin: boolean;
  delFlag: boolean;
  roleKey: string;
  roleName: string;
  bindUseCount: number;
  checked: boolean;
  hasRole: boolean;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  remarkTips?: string
}

export interface SysRolePageInfo {
  pageRoleInfo: PageResponse<SysRoleInfo>;
  roleIds?: number[];
  roleNames?: string[];
  authRole?: boolean;
}

export interface SysRoleQuery extends PageRequest{
  roleKey?: string;
  roleName?: string;
  roleId?: number;
}

export interface TipsInfo {
  title: string;
  content: string | undefined;
  type: 'success' | 'error' | 'info' | 'warning' | 404 | 403 | 500;
  showBtn: boolean;
}

export interface RoleDetailInfo {
  id?: number;
  admin: boolean;
  delFlag: boolean;
  roleKey?: string;
  roleName?: string;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  roleApiList?: string[] | number[];
  roleMenuList?: string[] | number[];
  remarkTips?: string;
}
