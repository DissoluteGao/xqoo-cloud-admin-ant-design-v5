import {SysUserRoleInfo} from "@/pages/system/UserRole/data";
import React, {ReactNodeArray, useEffect, useState} from "react";
import {Button, Card, Checkbox, Col, message, Modal, Popconfirm, Row, Space, Tooltip} from "antd";
import {CheckSquareFilled, DeleteOutlined, UsergroupDeleteOutlined} from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
import Settings from "../../../../../config/defaultSettings";
import {filter as _filter} from 'lodash';
import styles from '../index.less';

export interface UserRoleListRenderProps {
  userRoleList: SysUserRoleInfo[];
  loading: boolean;
  delUserRole: (userRoleIds: number[]) => void;
}


const UserRoleListRender: React.FC<UserRoleListRenderProps> = (props: UserRoleListRenderProps) => {
  const {userRoleList, loading, delUserRole} = props;
  const [checkedRemoveIdList, setCheckedRemoveIdList] = useState<number[]>([]);
  const [localRemoveRoleList, setLocalRemoveRoleList] = useState<SysUserRoleInfo[]>([]);
  const [checkedRemoveAll, setCheckedRemoveAll] = useState<boolean>(false);
  const [indeterminateRemove, setIndeterminateRemove] = useState<boolean>(true);
  const [listRenderNode, setListRenderNode] = useState<ReactNodeArray>([]);

  // 当前用户的角色烈表
  useEffect(() => {
    const tmpArr: SysUserRoleInfo[] = [];
    userRoleList.forEach(item => {
      item.checked = false;
      tmpArr.push(item)
    })
    setLocalRemoveRoleList(tmpArr);
  }, [userRoleList]);

  // 检测本地用户角色state变化
  useEffect(() => {
    initListRender();
  }, [localRemoveRoleList]);

  useEffect(() => {
    if(checkedRemoveIdList.length > 0){
      setIndeterminateRemove(true);
      setCheckedRemoveAll(false);
    }
    if(checkedRemoveIdList.length === localRemoveRoleList.length){
      setIndeterminateRemove(false);
      setCheckedRemoveAll(true);
    }
    if(checkedRemoveIdList.length < 1){
      setIndeterminateRemove(false);
      setCheckedRemoveAll(false);
    }
  }, [checkedRemoveIdList]);

  // 构建列表对象
  const initListRender = (): void => {
    const arr: any[] = [];
    localRemoveRoleList.forEach(item => {
      arr.push(generatorRenderItem(item));
    });
    setListRenderNode(arr);
  };

  // 点击卡片执行的逻辑
  const checkNowLiItem = (checkUserRoleId: number, clickCheck: boolean) => {
    handleRenderCheckLi(!clickCheck, checkUserRoleId);
    if(clickCheck){
      setCheckedRemoveIdList(_filter(checkedRemoveIdList, (item: number) => {return item !== checkUserRoleId}));
    }else{
      setCheckedRemoveIdList(checkedRemoveIdList.concat([checkUserRoleId]));
    }
  };

  // 更改渲染上的样式
  const handleRenderCheckLi = (changeToType: boolean, checkedUserRoleId?: number) => {
    const tmpArr: SysUserRoleInfo[] = [];
    localRemoveRoleList.forEach(item => {
      if(checkedUserRoleId && item.id === checkedUserRoleId){
        item.checked = changeToType;
      }
      if(!checkedUserRoleId){
        item.checked = changeToType;
      }
      tmpArr.push(item);
    });
    setLocalRemoveRoleList(tmpArr);
  };

  const generatorRenderItem = (itemData: SysUserRoleInfo) => {
    return <li key={itemData.id}>
      <Card
        hoverable={!itemData.checked}
        className={itemData.checked ? styles.hoverOnLi : ''}
      >
        <Row justify="space-around" align="middle">
          <Col span={21} className={styles.pointer} onClick={() => {checkNowLiItem(itemData.id, itemData.checked)}}>
            <Space align="center" className={styles.liSpaceDiv} size="large">
              <Tooltip title={itemData.roleName} overlay={undefined} color={Settings.primaryColor}>
                <div className={styles.liRoleNameText}>{itemData.roleName}</div>
              </Tooltip>
              <Tooltip title={itemData.remarkTips} overlay={undefined} color={Settings.primaryColor}>
                <div className={styles.remarkDiv}>备注: <span>{itemData.remarkTips}</span></div>
              </Tooltip>
            </Space>
            <div className={styles.liRoleDate}>
              <Space align="center" className={styles.liSpaceDiv}>
                添加日期:
                <Tooltip title={itemData.createDate} overlay={undefined} color={Settings.primaryColor}>
                  <span>{itemData.createDate || '初始化导入数据'}</span>
                </Tooltip>
                角色标识key:
                <Tooltip title={itemData.createDate} overlay={undefined} color={Settings.primaryColor}>
                  <span>{itemData.roleKey}</span>
                </Tooltip>
              </Space>
            </div>
          </Col>
          <Col span={1} className={styles.splitCol} />
          <Col span={2}>
            <div className={styles.operationBtn}>
              <Popconfirm
                placement="topRight"
                title='确认删除角色？'
                onConfirm={() => { deleteCheckedUserRole([itemData.id])}}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  loading={loading}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </div>
          </Col>
        </Row>
        {
          itemData.checked ? <div className={styles.checkedDiv}>
            <Tooltip title="已选中" overlay={undefined} color={Settings.primaryColor}>
              <CheckSquareFilled />
            </Tooltip>
          </div>
            :
            null
        }
      </Card>
    </li>
  };


  // 删除角色全选，取消全选
  const onCheckRemoveAllChange = (e: any) => {
    if(e.target.checked){
      const arr: number[] = [];
      localRemoveRoleList.forEach(item => {
        arr.push(item.id);
      });
      setCheckedRemoveIdList(arr);
      handleRenderCheckLi(true);
    }else{
      setCheckedRemoveIdList([]);
      handleRenderCheckLi(false);
    }
  };

  // 删除用户角色
  const deleteCheckedUserRole = (ids?: number[]) => {
    if(ids && ids.length > 0){
      delUserRole(ids)
    }else{
      if(checkedRemoveIdList.length < 1){
        message.warning('未选中需要删除的数据');
        return;
      }
      delUserRole(checkedRemoveIdList)
    }
  };

  return (
    <div>
      <Space align="center" className={styles.spaceHeight} size="large">
        <div key='removeAndCheckAll' className={styles.checkAndRemove}>
          <Checkbox
            indeterminate={indeterminateRemove}
            onChange={onCheckRemoveAllChange}
            checked={checkedRemoveAll}
          >
            全选
          </Checkbox>
          <Button
            type='primary'
            danger
            disabled={checkedRemoveIdList.length === 0}
            loading={loading}
            onClick={ () => {
              Modal.confirm({
                okText: '确认',
                cancelText: '取消',
                title: '确认信息',
                content: `是否确定删除${checkedRemoveIdList.length}条数据？`,
                onOk: () => {
                  deleteCheckedUserRole();
                },
              });
            }}
            icon={<UsergroupDeleteOutlined />}
          >
            批量删除
          </Button>
          <span>已选: [{checkedRemoveIdList.length}]项</span>
        </div>
        <span>拥有角色: {localRemoveRoleList.length}</span>
      </Space>
      <div className={styles.roleRenderDiv}>
        <QueueAnim className={[`${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')} component="ul" type={['left', 'right']} leaveReverse>
          {
            listRenderNode.length > 0 ? listRenderNode :
              null
          }
        </QueueAnim>
      </div>
    </div>
  );
};

export default UserRoleListRender;
