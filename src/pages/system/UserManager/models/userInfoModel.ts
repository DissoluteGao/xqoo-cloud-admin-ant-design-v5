import { useState, useCallback } from 'react';
import {AddUserInfoParam, QueryListParam, SysUserDetail} from "@/pages/system/UserManager/data";
import {
  addUserInfoToServer,
  changeServerUserStauts,
  getPageUserList,
  sendServerToDelUserInfo
} from "@/pages/system/UserManager/service";
import {filter as _filter} from 'lodash';

export default function userInfoModel() {
  const [userInfoList, setUserInfoList] = useState<SysUserDetail[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [number, setNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [alertTipsShow, setAlertTipsShow] = useState<boolean>(false);
  const [alertTipsMessage, setAlertTipsMessage] = useState<string>('');
  const [alertTipsType, setAlertTipsType] = useState<'info'|'warning'|'success'|'error'|undefined>('info');

  // 查询用户
  const getUserPage = useCallback((queryParams: QueryListParam) => {
    setLoading(true);
    getPageUserList(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setUserInfoList(res.data?.content || []);
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

  // 删除用户
  const delUser = useCallback(async (userId: string): Promise<boolean> => {
    setLoading(true);
    return await sendServerToDelUserInfo(userId).then(res => {
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
  }, []);

  const changeUserStatus = useCallback( async (type: 'freeze'|'deny'|'unFreeze'|'unDeny', userId: string): Promise<boolean> => {
    setLoading(true);
    const handleText = (type: 'freeze'|'deny'|'unFreeze'|'unDeny'): string => {
      let returnText = '完成';
      switch (type) {
        case "deny":
          returnText = '锁定账户';
          break;
        case "freeze":
          returnText = '停用账户';
          break;
        case "unDeny":
          returnText = '解锁账户';
          break;
        case "unFreeze":
          returnText = '恢复账户';
          break;
        default:
          returnText = '完成';
      }
      return returnText;
    };
    return await changeServerUserStauts(type, userId).then(res => {

      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', `${handleText(type)}成功`, true, 3000);
        return true;
      }
      alertTipsHandle('warning', `${handleText(type)}失败：`+ res.message, true);
      return false;
    }).catch(e => {
      alertTipsHandle('error', `${handleText(type)}发生错误，执行失败：`, true);
      return false;
    });
  }, []);

  // 新增用户
  const AddUserInfo = useCallback(async (values: AddUserInfoParam): Promise<boolean> => {
    setLoading(true);
    return await addUserInfoToServer(values).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '新增成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '新增失败：' + res.message, true);
      return false;
    }
    ).catch(e => {
      alertTipsHandle('error', '新增用户发生错误，新增失败', true);
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
    userInfoList,
    totalElements,
    totalPages,
    number,
    first,
    last,
    loading,
    hasError,
    errorMessage,
    getUserPage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    delUser,
    AddUserInfo,
    alertTipsHandle,
    changeUserStatus
  }
}
