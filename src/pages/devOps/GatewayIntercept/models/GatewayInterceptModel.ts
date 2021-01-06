import {useCallback, useState} from "react";
import {GatewayInterceptQuery, GatewayInterceptResult} from "@/pages/devOps/GatewayIntercept/data";
import {getInterceptLogPageRecord} from "@/pages/devOps/GatewayIntercept/service";


export default function GatewayInterceptModel() {
  const [interceptLog, setInterceptLog] = useState<GatewayInterceptResult[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [number, setNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 查询用户
  const getInterceptLog = useCallback((queryParams: GatewayInterceptQuery) => {
    setLoading(true);
    getInterceptLogPageRecord(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setInterceptLog(res.data?.content || []);
        setTotalElements(res.data?.totalElements || 0);
        setNumber(res.data?.number || 1);
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

  return {
    interceptLog,
    totalElements,
    totalPages,
    number,
    first,
    last,
    loading,
    hasError,
    errorMessage,
    getInterceptLog
  }
}
