import {Alert, Badge, Col, Descriptions, Divider, Result, Row, Skeleton} from "antd";
import React, {useEffect, useState} from "react";
import {UsergroupAddOutlined} from "@ant-design/icons";
import {SysUserDetail} from "@/pages/system/UserManager/data";
import {useModel} from "@@/plugin-model/useModel";
import UserRoleListRender from "@/pages/system/UserRole/components/UserRoleListRender";
import styles from '../index.less';
import {PageRequest} from "@/services/PublicInterface";
import UserHasNoRoleListRender from "@/pages/system/UserRole/components/UserHasNoRoleListRender";

export interface UserRoleDetailProps {
  checkedUserId: string|undefined;
  checkedUserInfo: SysUserDetail;
}

const UserRoleDetail: React.FC<UserRoleDetailProps> = (props: UserRoleDetailProps) => {
  const { checkedUserId, checkedUserInfo } = props;
  const {userRoleLoading, userRoleHasError, userRoleHasErrorType, userRoleErrorMessage, alertTipsShow, alertTipsMessage, alertTipsType,
    alertTipsHandle, userOnlined, superAdmin, userRoleList, getUserRoleDetailInfoFromServer,
    deleteUserRoleListToServer, addUserRoleInfoToServer} = useModel("system.UserRole.UserRoleInfoModel");
  const {userNoRoleLoading, userNoRoleHasError, userNoRoleHasErrorType, userNoRoleErrorMessage, userNoRoleList, totalElements,
    number, getUserNoRoleDetailInfoFromServer, totalPages, first, last} = useModel("system.UserRole.UserHasNoRoleListModel");
  const [noRolePageInfo, setNoRolePageInfo] = useState<PageRequest>({page: 1, pageSize: 10});
  const [localCheckedUserId, setLocalCheckedUserId] = useState<string>('0');


  // 获取
  useEffect(() => {
    if(checkedUserId){
      getUserRoleDetailInfoFromServer(checkedUserId);
      getUserNoRoleDetailInfoFromServer(checkedUserId, noRolePageInfo);
      setLocalCheckedUserId(checkedUserId);
    }
  }, [checkedUserId]);


  const lastPage = () => {
    let page: number = noRolePageInfo.page - 1;
    if(page < 1){
      page = 1
    }
    setNoRolePageInfo({page: page, pageSize: noRolePageInfo.pageSize});
    getUserNoRoleDetailInfoFromServer(localCheckedUserId, {page, pageSize: noRolePageInfo.pageSize});
  };

  const nextPage = () => {
    let page: number = noRolePageInfo.page + 1;
    if(page > totalPages){
      page = totalPages
    }
    setNoRolePageInfo({page: page, pageSize: noRolePageInfo.pageSize});
    getUserNoRoleDetailInfoFromServer(localCheckedUserId, {page, pageSize: noRolePageInfo.pageSize});
  };

  const delUserRole = async (userRoleIds: number[]) => {
    if(!checkedUserId){
      alertTipsHandle('error', '丢失用户id，无法完成操作', true, 3000);
      return;
    }
    const success = await deleteUserRoleListToServer(userRoleIds, checkedUserId);
    if(success){
      getUserRoleDetailInfoFromServer(localCheckedUserId);
      getUserNoRoleDetailInfoFromServer(localCheckedUserId, noRolePageInfo);
    }
  };

  const addUserRole = async (roleId: number[]) => {
    const success = await addUserRoleInfoToServer({userId: localCheckedUserId, roleId});
    if(success){
      getUserRoleDetailInfoFromServer(localCheckedUserId);
      getUserNoRoleDetailInfoFromServer(localCheckedUserId, noRolePageInfo);
    }
  }

  return (
    <div>
      <div className={styles.descriptionDiv}>
        <Skeleton active loading={userRoleLoading}>
          {
            alertTipsShow ? <Alert type={alertTipsType} message='提示信息' showIcon description={alertTipsMessage} />
            :
            superAdmin?
              <Alert type="warning" message="超级管理员无法查看" showIcon description="此为系统默认超级管理员，无法对其进行编辑和修改" />
              :
              <Descriptions title={"用户:" + checkedUserInfo.userName}>
                <Descriptions.Item label="登录状态">
                  {
                    userOnlined.onlined ? <Badge color="green" text="已登录" />
                      : <Badge color="red" text="未登录" />
                  }

                </Descriptions.Item>
                <Descriptions.Item label={<><UsergroupAddOutlined />角色数量</>}> : {userRoleList.length}</Descriptions.Item>
                <Descriptions.Item label="用户id">{checkedUserId}</Descriptions.Item>
              </Descriptions>
          }
        </Skeleton>
      </div>
      <Divider />
      <div>

        <div className={styles.userRoleDetailMainDiv}>
          <div key='operationBarDiv' className={styles.operationBar}>
            <Row>
              <Col span={11}>
                {
                  userRoleHasError ?
                    <div>
                      <Divider plain>用户已有角色</Divider>
                      <Result
                        title={userRoleErrorMessage}
                        status={userRoleHasErrorType}
                      />
                    </div>
                    :
                    <UserRoleListRender
                      userRoleList={userRoleList}
                      delUserRole={delUserRole}
                      loading={userRoleLoading}
                    />
                }
              </Col>
              <Col span={2} />
              <Col span={11}>
                {
                  userNoRoleHasError ?
                    <div>
                      <Divider plain>用户可用角色</Divider>
                      <Result
                        title={userNoRoleErrorMessage}
                        status={userNoRoleHasErrorType}
                      />
                    </div>
                    :
                    <UserHasNoRoleListRender
                      userHasNoList={userNoRoleList}
                      totalNums={totalElements}
                      currentPage={number}
                      pageSize={noRolePageInfo.pageSize}
                      totalPagesNum={totalPages}
                      isFirst={first}
                      isLast={last}
                      lastPage={lastPage}
                      nextPage={nextPage}
                      loading={userNoRoleLoading}
                      addUserRole={addUserRole}
                    />
                }
              </Col>
            </Row>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserRoleDetail;
