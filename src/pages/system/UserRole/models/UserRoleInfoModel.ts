import {useCallback, useState} from 'react';
import {addUserRole, deleteUserRole, getUserRoleListByUserId} from "@/pages/system/UserRole/service";
import {AddUserRoleInfo, SysUserRoleDetail, SysUserRoleInfo, UserOnlined} from "@/pages/system/UserRole/data";

export default function UserRoleInfoModel() {
  const [userRoleLoading, setUserRoleLoading] = useState<boolean>(false);
  const [userRoleHasError, setUserRoleHasError] = useState<boolean>(false);
  const [userRoleHasErrorType, setUserRoleHasErrorType] = useState<'info'|'warning'|'success'|'error'|undefined>('info');
  const [userRoleShowAddBtn, setUserRoleShowAddBtn] = useState<boolean>(false);
  const [userRoleErrorMessage, setUserRoleErrorMessage] = useState<string>('');
  const [alertTipsShow, setAlertTipsShow] = useState<boolean>(false);
  const [alertTipsMessage, setAlertTipsMessage] = useState<string>('');
  const [alertTipsType, setAlertTipsType] = useState<'info'|'warning'|'success'|'error'|undefined>('info');
  const [userOnlined, setUserOnlined] = useState<UserOnlined>({onlined: false, onlinedType: []});
  const [superAdmin, setSuperAdmin] = useState<boolean>(false);
  const [userRoleList, setUserRoleList] = useState<SysUserRoleInfo[]>([]);

  // 查询用户相关角色信息
  const getUserRoleDetailInfoFromServer = useCallback((userId: string) => {
    setUserRoleLoading(true);
    getUserRoleListByUserId(userId).then(res => {
      setUserRoleLoading(false);
      if(res.code === 200){
        if(res.data){
          const returnData: SysUserRoleDetail = res.data;
          setSuperAdmin(returnData.admin);
          setUserOnlined(returnData.onlined);
          setUserRoleList(returnData.userRoleList);
          if(returnData.admin){
            setUserRoleHasError(true);
            setUserRoleErrorMessage('当前用户为默认超级管理员，无法对其进行更改');
            setUserRoleHasErrorType("warning");
            setUserRoleShowAddBtn(false);
            return;
          }
          if(returnData.userRoleList.length < 1){
            setUserRoleHasError(true);
            setUserRoleErrorMessage('当前用户还没有任何角色');
            setUserRoleHasErrorType("info");
            setUserRoleShowAddBtn(true);
          }else{
            setUserRoleHasError(false);
          }
        }
      }else{
        setUserRoleHasError(true);
        setUserRoleErrorMessage(res.message);
        setUserRoleHasErrorType("error");
        setUserRoleShowAddBtn(false);
      }
    }).catch(e => {
      setUserRoleHasError(true);
      setUserRoleHasErrorType("error");
      setUserRoleErrorMessage("执行查询时发生了错误");
    });
  }, []);

  const deleteUserRoleListToServer = useCallback(async (userRoleId: number[], userId: string): Promise<boolean> => {
    setUserRoleLoading(true);
    return await deleteUserRole(userRoleId, userId).then(res => {
      setUserRoleLoading(false);
      if(res.code === 200){
        setUserRoleHasError(false);
        alertTipsHandle('success', '删除成功', true, 3000);
        return true;
      }
      setUserRoleHasError(false);
      alertTipsHandle('warning', '删除失败:' + res.message, true);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '删除用户角色发生错误，删除失败', true);
      return false;
    });
  }, []);

  const addUserRoleInfoToServer = useCallback(async (addUserRoleInfo: AddUserRoleInfo): Promise<boolean> => {
    setUserRoleLoading(true);
    return await addUserRole(addUserRoleInfo).then(res => {
      setUserRoleLoading(false);
      if(res.code === 200){
        setUserRoleHasError(false);
        alertTipsHandle('success', '新增完成', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '新增角色失败:' + res.message, true);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '新增用户角色发生错误，删除失败', true);
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
    userRoleLoading,
    userRoleHasError,
    userRoleHasErrorType,
    userRoleShowAddBtn,
    userRoleErrorMessage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    userOnlined,
    superAdmin,
    userRoleList,
    getUserRoleDetailInfoFromServer,
    deleteUserRoleListToServer,
    addUserRoleInfoToServer,
    alertTipsHandle
  }
}
