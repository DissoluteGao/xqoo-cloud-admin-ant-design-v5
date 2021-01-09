import React, {ReactNode, ReactNodeArray, useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Pagination,
  Result,
  Row,
  Badge,
  Tooltip,
  Alert,
  Popconfirm
} from 'antd';
import QueueAnim from 'rc-queue-anim';
import {history} from 'umi';
import {SysRoleInfo, SysRolePageInfo, SysRoleQuery, TipsInfo} from "@/pages/system/RoleManager/data";
import { assign as _assign, remove as _remove } from 'lodash';
import {getPageRoleInfo, removeServerRoleInfo} from "@/pages/system/RoleManager/service";
import {EditOutlined, DeleteOutlined, SettingOutlined, UserAddOutlined, UsergroupAddOutlined, UserSwitchOutlined} from "@ant-design/icons";
import {useModel} from "@@/plugin-model/useModel";
import UpdateRoleInfo from "@/pages/system/RoleManager/components/UpdateRoleInfo";
import styles from './index.less';

const pathHash = history.location;

const RoleManager: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const [roleInfoChange, setroleInfoChange] = useState<boolean>(false);
  const [loadingRoleInfo, setLoadingRoleInfo] = useState<boolean>(false);
  const [roleInfoList, setRoleInfoList] = useState<SysRoleInfo []>([]);
  const [roleInfo, setRoleInfo] = useState<SysRolePageInfo|undefined>(undefined);
  const [hasData, setHasData] = useState<boolean>(false);
  const [errorQuery, setErrorQuery] = useState<boolean>(true);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [queryParam, setQueryParam] = useState<SysRoleQuery>({ page: 1, pageSize: 24 });
  const [tipsInfoState, setTipsInfoState] = useState<TipsInfo>({title: '请稍后...', content: '正在查询中,请耐心等待.', type: "info", showBtn: false });
  const [titleText, setTitleText] = useState<string>('初始化...');
  const [alertTips, setAlertTips] = useState<{type?: 'success' | 'info' | 'warning' | 'error', message?: string, show: boolean}>({type: 'info', message: '提示信息', show: false});
  const [checkRoleId, setCheckRoleId] = useState<string|number|undefined>(undefined);
  const { initialState } = useModel('@@initialState');
  // 服务器拉取数据
  const getRoleListFromServer = async (queryParam: SysRoleQuery): Promise<SysRoleInfo[] | undefined> => {
    setTitleText('查询中...');
    const data = await getPageRoleInfo(queryParam);
    setLoadingRoleInfo(false);
    if(data.code === 200 && data.data){
      setRoleInfo(data.data);
      setErrorQuery(false);
      setTitleText('角色列表');
      setAlertTips({ show: false });
      return data.data.pageRoleInfo.content;
    }else{
      setHasData(false);
      setErrorQuery(true);
      setTitleText('查询失败');
      setAlertTips({type: 'error', message: data.message, show: true});
      setTipsInfoState({title: '查询发生错误', content: data.message, type: "error", showBtn: false});
      return undefined;
    }
  };

  // 获取查询的角色列表
  const queryRoleList = (tmpQueryParam?: SysRoleQuery) => {
    let nowQueryParam;
    if(tmpQueryParam){
      setQueryParam(tmpQueryParam);
      form.setFieldsValue(tmpQueryParam);
      nowQueryParam = tmpQueryParam;
    }else{
      nowQueryParam = queryParam;
    }
    setLoadingRoleInfo(true);
    getRoleListFromServer(nowQueryParam).then(res => {
      if(res && res.length > 0){
        setHasData(true);
        setroleInfoChange(false);
        setTimeout(() => {
          setRoleInfoList(res);
          setroleInfoChange(true);
        }, 300);
      }
      if(res && res.length == 0){
        setHasData(false);
        setTipsInfoState({title: '未找到内容', content: '没有找到相关数据，请重新选择查询条件或新增角色信息', type: "warning", showBtn: true});
      }
    }).catch(e => {
      console.error('[获取角色信息失败]', e);
    });
  };

  // 初始化地址栏参数查询
  const initQuery = () => {
    const { query } = pathHash
    const initQueryParam: SysRoleQuery = query as unknown as SysRoleQuery;
    if(initQueryParam){
      const obj: SysRoleQuery = _assign({}, queryParam, initQueryParam);
      queryRoleList(obj);
    }
  };

  useEffect(() => {
    initQuery();
  },[JSON.stringify(pathHash.query)]);

  // 生成角色卡片组title
  const generatorCardTitle = (): ReactNode => {
    const showTotal = (total: number) => {
      return `总计 ${total} 条`;
    };
    return <Row justify="space-around" align="middle">
      <Col xxl={2} md={2} xs={12}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          danger
          loading={loadingRoleInfo}
          disabled={!roleInfo?.authRole}
          onClick={() => showRoleUpdateModal(undefined)}
        >新增角色</Button>
      </Col>
      <Col xxl={2} md={3} xs={12}>
        <span>
          <UsergroupAddOutlined />
        </span>
        {titleText}
      </Col>
      <Col xxl={3} md={3} xs={12}>
        { errorQuery ? null : <div className={styles.roleCardPlainText}>
            {
              initialState?.currentUser?.admin ? `当前为超级管理员，有用所有权限`
                :
                `您的账号共有[${roleInfo?.roleIds?.length || 0}]个角色`
            }

        </div>}
      </Col>
      <Col xxl={12} md={10} xs={0} />
      <Col xxl={5} md={6} xs={24}>
        {
          errorQuery ? null : <Pagination
            size="small"
            total={roleInfo?.pageRoleInfo.totalElements || 0}
            current={roleInfo?.pageRoleInfo.number || 1}
            defaultPageSize={queryParam.pageSize}
            pageSizeOptions={['24', '72']}
            showTotal={showTotal}
            showQuickJumper
            showSizeChanger
            onChange={(page: number, pageSize: number|undefined) => {
              queryRoleList(_assign({}, queryParam, { page, pageSize }))
            }}
          />
        }
      </Col>
    </Row>
  };

  // 生成角色明细
  const generatorRoleList = (): ReactNodeArray|ReactNode => {
    const genCardContent = (node: SysRoleInfo) => {
      return <Card.Grid className={styles.roleCardGrid}>
        <Row style={{ padding: '24px'}}>
          <Col span={24} style={{height: '10px'}} />
          <Col span={24} className={styles.roleCardGridRoleKey}>角色标识：{node.roleKey}</Col>
          <Col span={24} className={styles.roleCardGridRoleName}>{node.roleName}</Col>
          <Col span={24} className={styles.roleCardGridRoleKey}>创建日期：{node.createDate}</Col>
          <Col span={24} className={styles.roleCardGridRoleKey}>最近更新：{node.updateDate}</Col>
          <Col span={24} className={styles.roleCardGridRoleKey}>
            <Tooltip overlay={undefined} title={`此角色已绑定用户${node.bindUseCount}人`}>
              <UserSwitchOutlined />：{node.bindUseCount}
            </Tooltip>
          </Col>
        </Row>
        <Row className={styles.operationBar}>
          <Col span={8} className={styles.iconOperation}>
            <Tooltip overlay={undefined} title="分配角色">
              <Button type="link" icon={<SettingOutlined key="setting" />} disabled={!roleInfo?.authRole} onClick={() => {history.replace('/system/userRole')}} />
            </Tooltip>
          </Col>
          <Col span={8} className={styles.iconOperation}>
            <Tooltip overlay={undefined} title="编辑角色">
              <Button type="link" icon={<EditOutlined key="edit" />} disabled={!roleInfo?.authRole} onClick={() => {showRoleUpdateModal(node.id)}} />
            </Tooltip>
          </Col>
          <Col span={8} className={styles.iconOperation}>
            {
              node.bindUseCount && node.bindUseCount > 0?
                <Tooltip overlay={undefined} title="此角色仍有用户绑定，无法删除" color="red">
                  <Button type="link" icon={<DeleteOutlined />} disabled />
                </Tooltip>
                :
                <Popconfirm placement="top" title='确认删除？' onConfirm={() => removeRoleInfo(node.id)} okText="确定" cancelText="取消">
                  <Button type="link" icon={<DeleteOutlined />} disabled={!roleInfo?.authRole} />
                </Popconfirm>
            }
          </Col>
        </Row>
      </Card.Grid>;
    };
    const eleArr: ReactNodeArray = [];
    roleInfoList.forEach(item => {
      eleArr.push(<Col key={item.id} md={4} xs={12}>
        {
          item.hasRole ?
            <Badge.Ribbon text="您已拥有此角色" placement="start">
              {genCardContent(item)}
            </Badge.Ribbon>
            :
            genCardContent(item)
        }
      </Col>);
    });
    return eleArr;
  };

  // 删除角色
  const removeRoleInfo = (id: number) => {
    setLoadingRoleInfo(true);
    removeServerRoleInfo(id).then(res => {
      setLoadingRoleInfo(false);
      if(res.code === 200){
        const newArr = _remove(roleInfoList, (item) => {
          return item.id !== id
        });
        setRoleInfoList(newArr);
        setAlertTips({ type: 'success', message: '删除角色成功', show: true});
        scrollToAnchor('roleTipsTop');
        setTimeout(() => {
          queryRoleList();
          setAlertTips({ show: false});
        }, 2000);
      }else{
        scrollToAnchor('roleTipsTop');
        setAlertTips({ type: 'warning', message: res.message, show: true})
      }
    }).catch(e => {
      scrollToAnchor('roleTipsTop');
      console.error('remove role info error !', e);
      setLoadingRoleInfo(false);
      setAlertTips({ type: 'error', message: '删除角色发生错误，请稍后再试', show: true})
    });

  };

  // 通用返回界面
  const renderDetailRight = () => {
    return <Result
      status={tipsInfoState.type}
      title={tipsInfoState.title}
      subTitle={tipsInfoState.content}
      extra={
        tipsInfoState.showBtn ?
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            danger
            loading={loadingRoleInfo}
            disabled={!roleInfo?.authRole}
            onClick={() => showRoleUpdateModal(undefined)}
          >新增角色</Button>
          : null
      }
    />
  };

  // 查询表单提交
  const onFinish = (values: any) => {
    queryRoleList(_assign({}, queryParam, values));
  };

  // 滚动到指定位置
  const scrollToAnchor = (anchorName: string) => {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if(anchorElement) {
        anchorElement.scrollIntoView(
          {behavior: 'smooth'}
        );
      }
    }
  };

  const showRoleUpdateModal = (roleId?: number|string|undefined) => {
    setShowUpdateModal(true);
    setCheckRoleId(roleId);
  };

  const updateOk = (status: any, message: string) => {
    setShowUpdateModal(false);
    let type: 'success'|'error'|'warning'|'info'|undefined = 'success';
    if(status === 200){
      setTimeout(() => {
        queryRoleList();
        setAlertTips({ show: false});
      }, 2000);
    }else if(status === 201){
      type = 'warning';
    }else{
      type = 'error';
    }
    setAlertTips({ type, message: message, show: true});
    scrollToAnchor('roleTipsTop');
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  };


  return (
    <PageContainer>
      <Form
        className={styles.operationDiv}
        form={form}
        name="roleQueryForm"
        onFinish={onFinish}
      >
        <Row justify="space-around" align="middle">
          <Col md={4} xs={24}>
            <Form.Item
              label='角色名称：'
              name='roleName'>
              <Input placeholder='请输入角色名称查询' />
            </Form.Item>
          </Col>
          <Col md={4} xs={23} offset={1}>
            <Form.Item
              label='角色标识：'
              name='roleKey'>
              <Input placeholder='请输入角色标识字符查询' />
            </Form.Item>
          </Col>
          <Col md={15} xs={0} />
          <Col md={1} xs={12}>
            <Button type='primary' htmlType="submit" loading={loadingRoleInfo}>查询</Button>
          </Col>
          <Col md={1} xs={12}>
            <Button type='default' loading={loadingRoleInfo} onClick={() => { form.resetFields()}}>重置</Button>
          </Col>
          <Col md={22} xs={0} />
        </Row>
      </Form>
      <div style={{marginTop: '20px'}}>
        <a href="#" id="roleTipsTop" />
        <QueueAnim key="removeRoleInfo"
                   type={['right', 'left']}
                   ease={['easeOutQuart', 'easeInOutQuart']}>
          {
            alertTips.show ? <Alert
              message={alertTips.message}
              showIcon
              type={alertTips.type}
              closeText={<div
                onClick={() => {setAlertTips({show: false})}}>
                我知道了
              </div>
              }
            /> : null
          }
        </QueueAnim>
      </div>
      <div className={styles.roleCardDiv}>
        <Row>
          <Col span={24}>
            <Card title={generatorCardTitle()}
                  className={styles.roleCard}
            >
              {
                hasData? <QueueAnim key="demo"
                                    type={['left', 'left']}
                                    ease={['easeOutQuart', 'easeInOutQuart']}>
                    {
                      roleInfoChange ?
                        <Row key='mainContent'>
                          {
                            generatorRoleList()
                          }
                        </Row>
                        : renderDetailRight()
                    }
                  </QueueAnim>
                  : renderDetailRight()
              }
            </Card>
          </Col>
        </Row>
      </div>
      <UpdateRoleInfo
        titleText={checkRoleId ? '修改角色' : '新增角色'}
        showModal={showUpdateModal}
        roleId={checkRoleId}
        onOkModal={updateOk}
        onCloseModal={closeUpdateModal}
      />
    </PageContainer>
  );
};

export default RoleManager;
