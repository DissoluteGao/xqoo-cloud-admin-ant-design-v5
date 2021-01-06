import {useCallback, useState} from "react";
import {OperationLog, QueryOperationLog} from "@/pages/devOps/OperationLog/data";
import {
  getOperationLog, getOperationLogData
} from "@/pages/devOps/OperationLog/service";
import {message} from "antd";


export default function UserLoginHistoryModel() {
  const [operationLogList, setOperationLogList] = useState<OperationLog[]>([]);
  const [operatorData, setOperatorData] = useState<string>();
  const [number, setNumber] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 查询
  const getOperLog = useCallback((queryParams: QueryOperationLog) => {
    setLoading(true);
    getOperationLog(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setOperationLogList(res.data?.content || []);
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

  const getOperatorData = useCallback ((logId: string, type: 'request'|'response') => {
    setLoading(true);
    getOperationLogData(logId, type).then((res) => {
      setLoading(false);
      if(res.code === 200){
        if(res.data?.hasData){
          setOperatorData(res.data?.content);
        }else{
          message.error(`当前操作日志没有参数`);
        }
      }else{
        message.error(`获取操作日志参数发生错误:${res.message}`);
      }
    }).catch(e => {
      message.error(`获取操作日志参数发生错误`);
    });
  }, []);

  return {
    operationLogList,
    operatorData,
    totalElements,
    totalPages,
    number,
    first,
    last,
    loading,
    hasError,
    errorMessage,
    getOperLog,
    getOperatorData
  }
}
