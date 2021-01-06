// 菜单路由简要信息结构
import ex from "umi/dist";
import {MenuHeaderTheme, MenuLayOutEnum} from "@/pages/system/MenuManager/enums";

export interface SimpleMenuInfo {
  key: number;
  defaultFlag?: boolean;
  path?: string;
  name?: string;
  component?: string;
  hideInMenu?: boolean,
  icon?: string;
  children?: SimpleMenuInfo[];
  title: string;
  value: number;
}
// 单个菜单明细信息结构
export interface MenuDetailInfo extends MenuDetailFormInfo{
  id: number | undefined;
  delFlag: number;
  defaultFlag: boolean;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  remarkTips?: string
}

export interface MenuDetailFormInfo {
  parentId: number;
  hasChild: boolean;
  sortNo: number;
  outSideJump: boolean;
  parentPath?: string;
  path: string;
  target?: string;
  name?: string;
  component?: string;
  chineseName?: string;
  icon?: string;
  hideInMenu: boolean;
  parentKeys?: string[];
  menuRender: boolean;
  menuHeaderRender?: boolean;
  fixSiderbar: boolean;
  layout?: MenuLayOutEnum;
  navTheme?: MenuHeaderTheme;
  headerRender: boolean;
  fixedHeader: boolean;
  headerTheme?: MenuHeaderTheme;
  footerRender: boolean;
}


