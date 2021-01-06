import {useCallback, useState} from "react";
import {TableEntity} from "@/pages/code/generator/data";
import {getTableInfoByDataSourceId, removeCacheTables} from "@/pages/code/generator/service";
import {ResponseData} from "@/services/PublicInterface";


export default function TableQueryModel() {
  const [tableInfoList, setTableInfoList] = useState<TableEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 查询表
  const getTableInfoFromServer = useCallback((dataSourceId: number) => {
    setLoading(true);
    getTableInfoByDataSourceId(dataSourceId).then((res: ResponseData<TableEntity[]>) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setTableInfoList(res.data || []);
      }else{
        setHasError(true);
        setErrorMessage(res.message);
      }
    }).catch(e => {
      setLoading(false);
      setHasError(true);
      setErrorMessage("执行查询时发生了错误");
    });
  }, []);

  // 刷新缓存
  const removeCacheTablesFromServer = useCallback((dataSourceId: number) => {
    setLoading(true);
    removeCacheTables(dataSourceId).then((res: ResponseData<string>) => {
      setLoading(false);
      if(res.code === 200){
        getTableInfoFromServer(dataSourceId);
      }else{
        setHasError(true);
        setErrorMessage(res.message);
      }
    }).catch(e => {
      setLoading(false);
      setHasError(true);
      setErrorMessage("执行查询时发生了错误");
    });
  }, []);

  return {
    tableInfoList,
    loading,
    hasError,
    errorMessage,
    getTableInfoFromServer,
    removeCacheTablesFromServer
  }
};
