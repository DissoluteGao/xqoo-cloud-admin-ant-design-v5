import {SysRoleInfo} from "@/pages/system/RoleManager/data";
import React, {ReactNodeArray, useEffect, useState} from "react";
import {Button, Card, Checkbox, Col, message, Modal, Popconfirm, Row, Space, Tooltip} from "antd";
import QueueAnim from "rc-queue-anim";
import {CheckSquareFilled, StepBackwardOutlined, StepForwardOutlined, UserAddOutlined} from "@ant-design/icons";
import Settings from "../../../../../config/defaultSettings";
import {filter as _filter} from "lodash";
import styles from '../index.less';

export interface UserHasNoRoleListRenderProps {
  userHasNoList: SysRoleInfo[];
  totalNums: number;
  currentPage: number;
  pageSize: number;
  totalPagesNum: number;
  isFirst: boolean;
  isLast: boolean;
  loading: boolean;
  lastPage: () => void;
  nextPage: () => void;
  addUserRole: (roleIds: number[]) => void;
}


const UserHasNoRoleListRender: React.FC<UserHasNoRoleListRenderProps> = (props: UserHasNoRoleListRenderProps) => {
  const {userHasNoList, totalNums, currentPage, pageSize, isFirst, isLast, loading, totalPagesNum, lastPage, nextPage, addUserRole} = props;
  const [checkedAddIdList, setCheckedAddIdList] = useState<number[]>([]);
  const [localAddRoleList, setLocalAddRoleList] = useState<SysRoleInfo[]>([]);
  const [checkedAddAll, setCheckedAddAll] = useState<boolean>(false);
  const [indeterminateAdd, setIndeterminateAdd] = useState<boolean>(true);
  const [listRenderNode, setListRenderNode] = useState<ReactNodeArray>([]);

  // 当前用户没有的角色烈表
  useEffect(() => {
    const tmpArr: SysRoleInfo[] = [];
    userHasNoList.forEach(item => {
      item.checked = false;
      tmpArr.push(item)
    })
    setLocalAddRoleList(tmpArr)
  }, [userHasNoList]);

  // 检测本地用户角色state变化
  useEffect(() => {
    initListRender();
  }, [localAddRoleList]);

  useEffect(() => {
    if(checkedAddIdList.length > 0){
      setIndeterminateAdd(true);
      setCheckedAddAll(false);
    }
    if(checkedAddIdList.length === localAddRoleList.length){
      setIndeterminateAdd(false);
      setCheckedAddAll(true);
    }
    if(checkedAddIdList.length < 1){
      setIndeterminateAdd(false);
      setCheckedAddAll(false);
    }
  }, [checkedAddIdList]);

  // 构建列表对象
  const initListRender = (): void => {
    const arr: any[] = [];
    localAddRoleList.forEach(item => {
      arr.push(generatorRenderItem(item));
    });
    setListRenderNode(arr);
  };

  // 点击卡片执行的逻辑
  const checkNowLiItem = (checkRoleId: number, clickCheck: boolean) => {
    handleRenderCheckLi(!clickCheck, checkRoleId);
    if(clickCheck){
      setCheckedAddIdList(_filter(checkedAddIdList, (item: number) => {return item !== checkRoleId}));
    }else{
      setCheckedAddIdList(checkedAddIdList.concat([checkRoleId]));
    }
  };

  // 更改渲染上的样式
  const handleRenderCheckLi = (changeToType: boolean, checkedRoleId?: number) => {
    const tmpArr: SysRoleInfo[] = [];
    localAddRoleList.forEach(item => {
      if(checkedRoleId && item.id === checkedRoleId){
        item.checked = changeToType;
      }
      if(!checkedRoleId){
        item.checked = changeToType;
      }
      tmpArr.push(item);
    });
    setLocalAddRoleList(tmpArr);
  };

  const generatorRenderItem = (itemData: SysRoleInfo) => {
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
                title='确认添加角色？'
                onConfirm={() => { addUserRoleToNowUser([itemData.id])}}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" loading={loading} shape="circle" icon={<UserAddOutlined />} />
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

  // 添加角色全选，取消全选
  const onCheckAddAllChange = (e: any) => {
    if(e.target.checked){
      const arr: number[] = [];
      localAddRoleList.forEach(item => {
        arr.push(item.id);
      });
      setCheckedAddIdList(arr);
      handleRenderCheckLi(true);
    }else{
      setCheckedAddIdList([]);
      handleRenderCheckLi(false);
    }
  };

  const addUserRoleToNowUser = (roleIds?: number[]) => {
    if(roleIds && roleIds.length > 0){
      addUserRole(roleIds);
    }else{
      if(checkedAddIdList.length < 1){
        message.warning('暂未选中新增的角色，请重试或退出刷新');
        return;
      }
      addUserRole(checkedAddIdList);
    }


  };


  return (
    <div>
      <Space align="center" className={styles.spaceHeight} size='middle'>
        <div key='addAndCheckAll' className={styles.checkAndRemove}>
          <Checkbox
            indeterminate={indeterminateAdd}
            onChange={onCheckAddAllChange}
            checked={checkedAddAll}
          >
            全选
          </Checkbox>
          <Button
            type='primary'
            disabled={checkedAddIdList.length === 0}
            loading={loading}
            onClick={() => {
              Modal.confirm({
                okText: '确认',
                cancelText: '取消',
                title: '确认信息',
                content: `是否确定添加${checkedAddIdList.length}条数据？`,
                onOk: () => {
                  addUserRoleToNowUser();
                },
              });
            }}
            icon={<UserAddOutlined />}
          >
            批量新增
          </Button>
          <span>已选: [{checkedAddIdList.length}]项</span>
        </div>
        <span>可用角色: {totalNums}</span>
      </Space>
      <div className={styles.noRolePageRender}>
        <Tooltip title="上一页" overlay={undefined} color={Settings.primaryColor}>
          <Button type='link' size='small' disabled={isFirst} icon={<StepBackwardOutlined />} onClick={() => {lastPage()}} />
        </Tooltip>
        { `${currentPage} / ${totalPagesNum}`}
        <Tooltip title="下一页" overlay={undefined} color={Settings.primaryColor}>
          <Button type='link' size='small' disabled={isLast} icon={<StepForwardOutlined />} onClick={() => {nextPage()}} />
        </Tooltip>
        <span>{pageSize} 条/页</span>
      </div>
      <div className={styles.roleRenderDiv} style={{marginTop: 0}}>
        <QueueAnim className={[`${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')} component="ul" type={['right', 'left']} leaveReverse>
          {
            listRenderNode.length > 0 ? listRenderNode :
              null
          }
        </QueueAnim>
      </div>
    </div>
  );
};

export default UserHasNoRoleListRender;
