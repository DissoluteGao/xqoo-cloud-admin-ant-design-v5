declare namespace API {
  /* export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  } */

  // 菜单
  export interface UserRoutes {
    path: string; // 路径
    name?: string; // 名字
    icon?: string; // 菜单图标
    layout?: boolean; //是否显示在菜单栏
    redirect?: string; // 跳转路径
    component?: string; // 关联组件路径
    routes?: UserRoutes[]; // 子路由
  }

  // 密码加密接口
  export interface PasswordSecret {
    password?: string;
    randomStr?: string;
    time?: number;
  }

  // 当前登录用户信息
  export interface CurrentUser {
    errCode?: string;
    token?: string;
    loginTime?: number;
    loginIp?: string;
    loginEnv?: string;
    userId?: string;
    lastLogin?: string;
    userName?: string;
    avatar?: string;
    admin?: boolean;
    roleIds?: number[];
    roleNames?: string[];
    unreadCount?: number;
  }

  // 统一返回消息体
  export interface ResponseEntity {
    code?: number;
    message?: string | undefined;
    data?: any;
  }

  // 登录返回
  export interface LoginStateType {
    code?: number;
    message?: string | undefined;
    data?: CurrentUser;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
}
