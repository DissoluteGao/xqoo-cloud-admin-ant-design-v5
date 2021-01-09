import {useCallback, useState} from "react";
import {GatewayRouteInfo, GatewayRouteQuery} from "@/pages/devOps/GatewayRoute/data";
import {denyClient, getRouteList, refreshRoute, resetClient} from "@/pages/devOps/GatewayRoute/service";
import {getLocalStorage} from "@/utils/utils";


export default function GatewayRouteModel() {
  const [gatewayRouteInfoList, setGatewayRouteInfoList] = useState<GatewayRouteInfo[]>([]);
  const [number, setNumber] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [alertTipsShow, setAlertTipsShow] = useState<boolean>(false);
  const [alertTipsMessage, setAlertTipsMessage] = useState<string>('');
  const [alertTipsType, setAlertTipsType] = useState<'info'|'warning'|'success'|'error'|undefined>('info');

  const getToken = (): string => {
    const currentUser: any = getLocalStorage('current', 'json');
    if(currentUser && currentUser.token){
      return currentUser.token;
    }
    return 'none';
  };

  // 查询
  const getRouteListFromServer = useCallback((queryParams: GatewayRouteQuery) => {
    setLoading(true);
    getRouteList(queryParams, getToken()).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setGatewayRouteInfoList(res.data?.content || []);
        setNumber(res.data?.number || 1);
        setTotalElements(res.data?.totalElements || 0);
        setTotalPages(res.data?.totalPages || 1);
        setFirst(res.data?.first || false);
        setLast(res.data?.last || false);
      }else{
        setHasError(true);
        setErrorMessage(res.message);
      }
    }).catch(e => {
      setHasError(true);
      setErrorMessage("执行查询时发生了错误");
    });
  }, []);

  // 禁用路由
  const denyClientToServer = useCallback(async (params: GatewayRouteQuery): Promise<boolean> => {
    setLoading(true);
    return await denyClient(params, getToken()).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '禁用成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '禁用失败:' + res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '禁用路由发生错误，禁用失败', true);
      return false;
    });
  }, []);

  // 启用路由
  const resetClientToServer = useCallback(async (params: GatewayRouteQuery): Promise<boolean> => {
    setLoading(true);
    return await resetClient(params, getToken()).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '启用成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '启用失败:' + res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '启用路由发生错误，启用失败', true);
      return false;
    });
  }, []);

  // 刷新路由
  const refreshRouteFromServer = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    return await refreshRoute(getToken()).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '路由推送完成', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '路由推送失败:' + res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '路由推送发生错误，推送失败', true);
      return false;
    });
  }, []);

  // 显示处理提示信息
  const alertTipsHandle = useCallback((type: 'info'|'warning'|'success'|'error'|undefined, message: string, show: boolean, autoClose?: number) => {
    setAlertTipsMessage(message);
    setAlertTipsType(type);
    setAlertTipsShow(show);
    if(autoClose){
      setTimeout(() => {
        setAlertTipsShow(false);
      }, autoClose);
    }
  }, []);

  return {
    gatewayRouteInfoList,
    totalElements,
    totalPages,
    number,
    first,
    last,
    loading,
    hasError,
    errorMessage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    getRouteListFromServer,
    denyClientToServer,
    resetClientToServer,
    refreshRouteFromServer,
    alertTipsHandle
  }
}
