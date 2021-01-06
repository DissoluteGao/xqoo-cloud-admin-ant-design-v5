import {useCallback, useState} from "react";
import {ColumnEntity} from "@/pages/code/generator/data";
import {ResponseData} from "@/services/PublicInterface";
import {getColumnInfoByDataSourceId, removeCacheColumns} from "@/pages/code/generator/service";

export default function TableQueryModel() {
  const [columnInfoList, setColumnInfoList] = useState<ColumnEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 查询表
  const getColumnInfoFromServer = useCallback((dataSourceId: number, tableName: string) => {
    setLoading(true);
    getColumnInfoByDataSourceId(dataSourceId, tableName).then((res: ResponseData<ColumnEntity[]>) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setColumnInfoList(res.data || []);
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
  const removeCacheColumnsFromServer = useCallback((dataSourceId: number, tableName: string) => {
    setLoading(true);
    removeCacheColumns(dataSourceId, tableName).then((res: ResponseData<string>) => {
      setLoading(false);
      if(res.code === 200){
        getColumnInfoFromServer(dataSourceId, tableName);
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
    columnInfoList,
    loading,
    hasError,
    errorMessage,
    getColumnInfoFromServer,
    removeCacheColumnsFromServer
  }
};
