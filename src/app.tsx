import React from 'react';
import { Settings as LayoutSettings, PageLoading } from '@ant-design/pro-layout';
import {message, notification} from 'antd';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import {getCacheCurrentUser, removeCacheCurrentUser} from './services/user';
import defaultSettings from '../config/defaultSettings';
import {BasicLayoutProps} from "@ant-design/pro-layout/lib/BasicLayout";
import {getLocalStorage} from "@/utils/utils";
import {getServerRoute} from "@/utils/route/serverRouteUtils";
import {MenuDataItem} from "@umijs/route-utils/dist/types";
import {loopMenuItem} from "@/utils/route/menuHandleTool";
import {stringify} from "querystring";
/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading tip={'正在进入系统.请稍后...'} />,
};

history.listen(async (location: any) => {
  const currentUser = await getCacheCurrentUser();
  if (currentUser?.token && location.pathname === '/auth/login') {
    history.push(-1);
  }
  if (!currentUser?.token && location.pathname !== '/auth/login') {
    history.replace('/auth/login');
  }
});
export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  menuData: MenuDataItem[];
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser>;
  fetchMenuInfo?: () => Promise<MenuDataItem[]>;
}> {
  // 获取缓存中用户信息
  const fetchUserInfo = async () => {
    const currentUser = await getCacheCurrentUser();
    if (currentUser && currentUser.token) {
      return currentUser;
    }
    history.push('/auth/login');
    return undefined;
  };

  const fetchMenuInfo = async (): Promise<MenuDataItem[]> => {
    const tmpData = await getServerRoute();
    const menuData = loopMenuItem(tmpData);
    if(menuData?.length > 0){
      return menuData;
    }
    return [];
  }
  try{
    const menuData = await fetchMenuInfo();
    const currentUser = await fetchUserInfo();
    if (currentUser) {
      const { query, pathname } = history.location;
      const { redirect } = query;
      if (pathname === '/auth/login') {
        if (redirect) {
          history.push(redirect);
        }
        history.push('/');
      }
      return {
        fetchUserInfo,
        fetchMenuInfo,
        currentUser,
        menuData,
        settings: defaultSettings,
      };
    }
  }catch (e) {
    return {
      fetchUserInfo,
      fetchMenuInfo,
      menuData: [],
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    fetchMenuInfo,
    menuData: [],
    settings: defaultSettings,
  };
}

export const layout = ({ initialState }: {
  initialState: {
    settings?: LayoutSettings;
    menuData: Promise<BasicLayoutProps>;
    currentUser?: API.CurrentUser;
  };
}) => {
  return {
    menuDataRender: (menuData: MenuDataItem) => initialState?.menuData || menuData,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== '/auth/login') {
        history.push('/auth/login');
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: { message: '成功', description: '服务器成功返回请求的数据' },
  201: { message: '成功', description: '新建或修改数据成功' },
  202: { message: '成功', description: '一个请求已经进入后台排队（异步任务）' },
  204: { message: '成功', description: '删除数据成功' },
  400: { message: '什么也没提交', description: '发出的请求有错误，服务器没有进行新建或修改数据的操作' },
  401: { message: '未授权操作', description: '当前没有登录或已过期' },
  402: { message: '未授权操作', description: '当前请求资源需要付费' },
  403: { message: '禁止操作', description: '用户得到授权，但是访问是被禁止的' },
  404: { message: '经典404', description: '发出的请求针对的是不存在的记录，服务器没有进行操作' },
  405: { message: '信息校验失败', description: '表单提交方法错误或表单值验证不通过' },
  406: { message: 'Oops', description: '执行逻辑中断了该操作' },
  408: { message: '等待太久了', description: '请求时间过长，丢失响应，请稍后再试。' },
  410: { message: '已成历史', description: '请求的资源被永久删除，且不会再得到的。' },
  412: { message: '太粗心了', description: '密码输入错误次数过多' },
  421: { message: '注意！', description: '账户已停用' },
  422: { message: '注意！', description: '账户已被冻结' },
  423: { message: '注意！', description: '账户已被冻结或锁定' },
  429: { message: '太热门啦！', description: '当前服务器访问量过大，喝一杯茶休息一下吧' },
  500: { message: '出错啦！', description: '服务器发生错误，请检查服务器' },
  502: { message: '出错啦！', description: '网关错误' },
  503: { message: '出错啦！', description: '服务不可用，服务器暂时过载或维护' },
  504: { message: '出错啦！', description: '网关超时' },
  510: { message: 'ip已被禁用！', description: '当前访问ip已被系统屏蔽，无法访问' },
  511: { message: '资源已被禁止', description: '所请求的资源被系统隔离，无法访问' },
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  const { pathname } = history.location;
  if (response && response.status) {
    const errorText: { message: string, description: string } = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    console.error('请求错误，状态:{},请求地址:{}', status, url)
    if(pathname !== '/auth/login') {
      notification.error({
        message: errorText.message,
        description: errorText.description,
        key: 'responseError'
      });
    }
    if(pathname !== '/auth/login' && status === 401){
      notification.error({
        message: errorText.message,
        description: `${errorText.description},即将返回登录页`,
        key: 'responseError'
      });
      const hide = message.loading('正在注销...', 0);
      removeCacheCurrentUser('current').then(() => {
        hide();
        const { query, pathname } = history.location;
        const { redirect } = query;
        // Note: There may be security issues, please note
        if (pathname !== '/auth/login' && !redirect) {
          history.replace({
            pathname: '/auth/login',
            search: stringify({
              redirect: pathname,
            }),
          });
        }
      });
    }
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

// 全局请求拦截器
const requestInterceptor = (url: string, options: any) => {
  // 这里只能直接去
  const currentUser: any = getLocalStorage('current', 'json');
  if (currentUser && currentUser.token) {
    return {
      options: {
        ...options,
        headers: {
          'xqoo-authorization': currentUser.token
        },
      },
    };
  }
  return {
    options: {
      ...options
    },
  };

};

export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [requestInterceptor]
};
