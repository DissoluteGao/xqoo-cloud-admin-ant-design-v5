import {useCallback, useState} from "react";
import {GatewayFiltersConfig, GatewayPredicatesConfig, GatewayRouteEntity} from "@/pages/devOps/GatewayRoute/data";
import {getLocalStorage} from "@/utils/utils";
import {getFiltersList, getPredicatesList, getSingleRouteInfo, putRouteInfo} from "@/pages/devOps/GatewayRoute/service";
import {message} from "antd";


export default function GatewayRouteUpdateModel() {
  const [gatewayRouteInfo, setGatewayRouteInfo] = useState<GatewayRouteEntity>();
  const [gatewayPredicatesList, setGatewayPredicatesList] = useState<GatewayPredicatesConfig[]>([]);
  const [gatewayFiltersList, setGatewayFiltersList] = useState<GatewayFiltersConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
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

  const clearInfo = useCallback(() => {
    setGatewayRouteInfo(undefined);
  }, []);

  // 查询
  const getRouteSingleFromServer = useCallback((routeId: string) => {
    setQueryLoading(true);
    getSingleRouteInfo(routeId, getToken()).then((res) => {
      setQueryLoading(false);
      if(res.code === 200){
        setHasError(false);
        setGatewayRouteInfo(res.data);
      }else{
        setHasError(true);
        setErrorMessage(res.message);
      }
    }).catch(e => {
      setQueryLoading(false);
      setHasError(true);
      setErrorMessage("执行查询时发生了错误");
    });
  }, []);

  // 获取断言配置参数
  const getPredicateConfigFromServer = useCallback(() => {
    getPredicatesList(getToken()).then((res) => {
      if(res.code === 200){
        setGatewayPredicatesList(res?.data || []);
      }else{
        message.warning('获取断言配置错误：' + res.message);
      }
    }).catch(e => {
      message.warning('获取断言配置错误, 查询失败');
    });
  }, []);

  // 获取过滤配置参数
  const getFilterConfigFromServer = useCallback(() => {
    getFiltersList(getToken()).then((res) => {
      if(res.code === 200){
        setGatewayFiltersList(res?.data || []);
      }else{
        message.warning('获取过滤配置错误：' + res.message);
      }
    }).catch(e => {
      message.warning('获取过滤配置错误, 查询失败');
    });
  }, []);

  // 推送更改路由信息
  const putRouteInfoToServer = useCallback(async (params: GatewayRouteEntity): Promise<boolean> => {
    setLoading(true);
    return await putRouteInfo(params, getToken()).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '保存成功,即将跳转...', true, 3000);
        return true;
      }
      alertTipsHandle('error', '保存失败:' + res.message, true);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '保存路由发生错误，保存失败', true);
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
    clearInfo,
    gatewayRouteInfo,
    gatewayPredicatesList,
    gatewayFiltersList,
    loading,
    queryLoading,
    hasError,
    errorMessage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    alertTipsHandle,
    getRouteSingleFromServer,
    getPredicateConfigFromServer,
    getFilterConfigFromServer,
    putRouteInfoToServer
  }
}
