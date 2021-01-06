import { getUserRoutes } from '@/services/user';
import { MenuDataItem } from '@umijs/route-utils/dist/types';
import { notification } from 'antd';
import {ResponseData} from "@/services/PublicInterface";

export const getServerRoute = async (): Promise<MenuDataItem[]> => {
  const returnData: ResponseData<MenuDataItem[]> = await getUserRoutes();
  if (returnData && returnData.code === 200) {
    return returnData.data;
  }
  console.error('get menu info error!', returnData.code, returnData.message);
  notification.error({
    message: '菜单发生错误',
    description: `没能查到您的权限信息哦，请退出重新登录`,
  });
  return [];
};
