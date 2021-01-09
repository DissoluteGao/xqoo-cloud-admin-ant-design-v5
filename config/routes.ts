export default [

  {
    path: "/auth",
    layout: false,
    routes: [{
      name: "login",
      path: "/auth/login",
      component: "./user/login"
    }]
  },
  /*  动态路由需要在此添加组件路径，如下所示即可，多级菜单的上级没有实际界面的情况需要指定一个默认页面或404均可
      否则点击面包屑时会乱跳
      路由有很多属性可添加，具体请参照后台路由配置表
      access为固定字段，权限过滤器，复制即可
   */
  { path: '/', redirect: '/welcome'}, // 默认跳转
  { path: '/welcome', component: './Welcome', access: 'routeFilter' }, // 首页
  { path: '/system', component: './Welcome', access: 'routeFilter' }, // 这条就是admin分组下的默认页面
  { path: '/system/menuInfo', component: './system/MenuManager', access: 'routeFilter' }, // 菜单管理页
  { path: '/system/roleInfo', component: './system/RoleManager', access: 'routeFilter' }, // 角色管理页
  { path: '/system/userManager', component: './system/UserManager', access: 'routeFilter' }, // 用户管理页
  { path: '/system/userRole', component: './system/UserRole', access: 'routeFilter' }, // 用户角色管理页

  { path: '/devOps', component: './Welcome', access: 'routeFilter' }, // 运维管理分组下的默认页面
  { path: '/devOps/third', component: './Welcome', access: 'routeFilter' }, // 运维管理第三方控制台分组下的默认页面
  { path: '/devOps/AuthProperties', component: './devOps/AuthProperties', access: 'routeFilter' }, // 授权中心配置概览
  { path: '/devOps/gatewayIntercept', component: './devOps/GatewayIntercept', access: 'routeFilter' }, // 网关拦截日志记录
  { path: '/devOps/userLoginHistory', component: './devOps/UserLoginHistory', access: 'routeFilter' }, // 用户登录历史
  { path: '/devOps/operationLog', component: './devOps/OperationLog', access: 'routeFilter' }, // 用户登录历史
  { path: '/devOps/gatewayRoute', component: './devOps/GatewayRoute', access: 'routeFilter' }, // 网关路由
  { path: '/devOps/gatewayRoute/updateGatewayRoute', component: './devOps/GatewayRoute/components/updateGatewayRoute', access: 'routeFilter' }, // 网关路由维护界面

  { path: '/code', component: './Welcome', access: 'routeFilter' }, // 代码管理分组下的默认页面
  { path: '/code/dataSource', component: './code/DataSource', access: 'routeFilter' }, // 数据源中心
  { path: '/code/codeGenerator', component: './code/CodeGenerator', access: 'routeFilter' }, // 代码生成界面
  { path: '/code/codeGenerator/tableGen', component: './code/generator/TableGen', access: 'routeFilter' }, // 根据数据库表生成页面
  { path: '/code/codeGenerator/microServiceGen', component: './code/generator/MicroServiceGen', access: 'routeFilter' }, // 生成微服务模块
  { path: '/code/codeGenerator/entityGen', component: './code/generator/EntityGen', access: 'routeFilter' }, // 生成实体bean

  {
    component: './404'
  },
];
