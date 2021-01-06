import {useCallback, useState} from "react";
import {DataSourceInfo, DataSourceType, QueryDataSourceInfo} from "@/pages/code/DataSource/data";
import {
  deleteDataSource,
  getDataBaseType,
  getDataSourceInfo,
  testConnect,
  updateDataSource
} from "@/pages/code/DataSource/service";
import {message} from "antd";


export default function UserLoginHistoryModel() {
  const [dataSourceList, setDataSourceList] = useState<DataSourceInfo[]>([]);
  const [dataSourceType, setDataSourceType] = useState<DataSourceType[]>([]);
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
  const [testConnectSuccess, setTestConnectSuccess] = useState<boolean>(false);
  const [testConnectLoading, setTestConnectLoading] = useState<boolean>(false);
  const [testConnectMessage, setTestConnectMessage] = useState<string>("正在尝试连接...");
  const [testConnectError, setTestConnectError] = useState<boolean>(false);

  // 查询用户
  const getDataSourceFromServer = useCallback((queryParams: QueryDataSourceInfo) => {
    setLoading(true);
    getDataSourceInfo(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setDataSourceList(res.data?.content || []);
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

  // 查询数据源类型
  const getDataSourceTypeFromServer = useCallback(() => {
    getDataBaseType().then(res => {
      if(res.code === 200){
        setDataSourceType(res.data || []);
      }else{
        message.error('查询数据源类型出错:' + res.message);
      }
    }).catch(e => {
      message.error('查询数据源类型出错,请稍后重试');
    });
  },[]);

  // 删除数据源
  const deleteDataSourceToServer = useCallback(async (id: number) => {
    setLoading(true);
    return await deleteDataSource(id).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '删除成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '删除失败:' + res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '删除用户发生错误，删除失败', true);
      return false;
    });
  },[]);

  // 新增/修改数据源
  const updateDataSourceToServer = useCallback(async (data: DataSourceInfo) => {
    setLoading(true);
    return await updateDataSource(data).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '操作成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '操作失败:' + res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '操作发生错误，删除失败', true);
      return false;
    });
  },[]);

  const testDataSource = useCallback((data: DataSourceInfo,type: string) => {
    setTestConnectLoading(true);
    setTestConnectSuccess(false);
    setTestConnectMessage("正在尝试连接...");
    testConnect(data, type).then(res => {
      setTestConnectLoading(false);
      setTestConnectSuccess(true);
      setTestConnectMessage(res.message);
      if(res.code === 200){
        setTestConnectError(false);
      }else{
        setTestConnectError(true);
      }
    }).catch(e => {
      setTestConnectError(true);
      setTestConnectSuccess(true);
      setTestConnectMessage("测试连接出现错误，请稍后再试");
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

  const resetTestConnect = useCallback(() => {
    setTestConnectLoading(false);
    setTestConnectSuccess(false);
    setTestConnectError(false);
    setTestConnectMessage("正在尝试连接...");
  }, []);

  return {
    dataSourceList,
    dataSourceType,
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
    testConnectSuccess,
    testConnectLoading,
    testConnectMessage,
    testConnectError,
    getDataSourceFromServer,
    getDataSourceTypeFromServer,
    deleteDataSourceToServer,
    testDataSource,
    resetTestConnect,
    updateDataSourceToServer,
    alertTipsHandle
  }
}
