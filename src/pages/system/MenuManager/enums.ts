// 菜单编辑页状态值枚举
export enum MenuManagerShowEnum {
  INIT = 'init',  //初始化状态
  PREPARE = 'prepare', // 新增准备状态
  SUCCESS = 'success', // 查询完成状态
  LOADING = 'loading', // 查询载入中状态
  NO_DATA = 'noData', // 查询完毕无结果状态
  ERROR = 'error', // 查询出错状态
  DELETED = 'deleted', // 删除成功
  ADDED = 'added', // 增加成功
}
// 菜单模式枚举
export enum MenuLayOutEnum {
  MIX = 'mix', //混合
  SIDE = 'side', //侧边栏
  TOP = 'top' //顶端
}
// 主题枚举
export enum MenuHeaderTheme {
  DARK = 'dark',
  LIGHT = 'light'
}
