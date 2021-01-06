import {useCallback, useState} from "react";
import {UserLoginHistoryQuery, UserLoginHistoryResult} from "@/pages/devOps/UserLoginHistory/data";
import {getUserLoginHistory} from "@/pages/devOps/UserLoginHistory/service";


export default function UserLoginHistoryModel() {
  const [userHistoryList, setUserHistoryList] = useState<UserLoginHistoryResult[]>([]);
  const [number, setNumber] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 查询用户
  const getLoginHistory = useCallback((queryParams: UserLoginHistoryQuery) => {
    setLoading(true);
    getUserLoginHistory(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setUserHistoryList(res.data?.content || []);
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

  return {
    userHistoryList,
    totalElements,
    totalPages,
    number,
    first,
    last,
    loading,
    hasError,
    errorMessage,
    getLoginHistory
  }
}
