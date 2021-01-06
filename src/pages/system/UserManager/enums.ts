
// 用户状态枚举
export enum SysUserStatusEnum {
  NORMAL = 0, // 正常
  DENY = 1, // 封禁
  FREEZE = 2 // 停用
}

// 用户类型枚举
export enum SysUserTypeEnum {
  CONSOLE_USER = 88, // 后台用户
  WEB_USER = 10, // web端用户
  TMP_USER = 9 // 临时用户
}
