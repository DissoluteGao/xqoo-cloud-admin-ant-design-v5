import {useCallback, useState} from "react";
import {SysRoleInfo} from "@/pages/system/RoleManager/data";
import {getUserNoRoleListByUserId} from "@/pages/system/UserRole/service";
import {UserNoRoleInfo} from "@/pages/system/UserRole/data";
import {PageRequest} from "@/services/PublicInterface";


export default function UserHasNoRoleListModel() {
  const [userNoRoleLoading, setUserNoRoleLoading] = useState<boolean>(false);
  const [userNoRoleHasError, setUserNoRoleHasError] = useState<boolean>(false);
  const [userNoRoleHasErrorType, setUserNoRoleHasErrorType] = useState<'info'|'warning'|'success'|'error'|undefined>('info');
  const [userNoRoleErrorMessage, setUserNoRoleErrorMessage] = useState<string>('');
  const [admin, setAdmin] = useState<boolean>(false);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [number, setNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [userNoRoleList, setUserNoRoleList] = useState<SysRoleInfo[]>([]);

// 查询用户相关角色信息
  const getUserNoRoleDetailInfoFromServer = useCallback((userId: string, pageInfo: PageRequest) => {
    setUserNoRoleLoading(true);
    getUserNoRoleListByUserId(userId, pageInfo).then(res => {
      setUserNoRoleLoading(false);
      if(res.code === 200){
        if(res.data){
          const returnData: UserNoRoleInfo = res.data;
          setAdmin(returnData.admin);
          setTotalElements(returnData.result.totalElements);
          setNumber(returnData.result.number);
          setTotalPages(returnData.result.totalPages);
          setFirst(returnData.result.first);
          setLast(returnData.result.last);
          setUserNoRoleList(returnData.result.content);
          if(returnData.admin){
            setUserNoRoleHasError(true);
            setUserNoRoleErrorMessage('当前用户为默认超级管理员，已拥有所有角色');
            setUserNoRoleHasErrorType("success");
            return;
          }
          if(returnData.result.content.length < 1){
            setUserNoRoleHasError(true);
            setUserNoRoleErrorMessage('当前用户已拥有所有角色');
            setUserNoRoleHasErrorType("info");
          }else{
            setUserNoRoleHasError(false);
          }
        }
      }else{
        setUserNoRoleHasError(true);
        setUserNoRoleErrorMessage(res.message);
        setUserNoRoleHasErrorType("error");
      }
    }).catch(e => {
      setUserNoRoleHasError(true);
      setUserNoRoleHasErrorType("error");
      setUserNoRoleErrorMessage("执行查询时发生了错误");
    });
  }, []);

  return {
    userNoRoleLoading,
    userNoRoleHasError,
    userNoRoleHasErrorType,
    userNoRoleErrorMessage,
    admin,
    userNoRoleList,
    totalElements,
    number,
    totalPages,
    first,
    last,
    getUserNoRoleDetailInfoFromServer,
  }
}
