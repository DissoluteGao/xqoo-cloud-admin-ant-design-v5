import React, {useEffect, useState} from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Col, Form, Input, Pagination, Result, Row, Space, Tooltip} from "antd";
import {UserOutlined, UsergroupAddOutlined, IdcardOutlined} from "@ant-design/icons";
import Settings from "../../../../config/defaultSettings";
import ProSkeleton from '@ant-design/pro-skeleton';
import QueueAnim from "rc-queue-anim";
import {useModel} from "@@/plugin-model/useModel";
import {SysUserDetail} from "@/pages/system/UserManager/data";
import {assign as _assign} from "lodash";
import {history} from 'umi';
import styles from './index.less';
import UserRoleDetail from "@/pages/system/UserRole/components/userRoleDetail";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 14 },
    md: { span: 16 },
  },
};


const UserRole: React.FC<{}> = () => {
  const [userQueryForm] = Form.useForm();
  const [userItemList, setUserItemList] = useState<any[]>([]);
  const [userListData, setUserListData] = useState<SysUserDetail[]>([]);
  const { userInfoList, totalElements, loading, hasError, errorMessage, getUserPage} = useModel('system.UserManager.userInfoModel');
  const [pageInfo, setPageInfo] = useState<{ page: number, pageSize: number}>({page:1, pageSize:6});
  const [checkedUserId, setCheckUserId] = useState<string|undefined>(undefined);
  const [checkedUserInfo, setCheckedUserInfo] = useState<SysUserDetail>({
    checked: false,
    createBy: "",
    createDate: "",
    lastLoginTime: "",
    loginId: "",
    profileUrl: "",
    remarkTips: null,
    roleCount: 0,
    updateBy: "",
    updateDate: "",
    userId: "",
    userName: "",
    userStatus: undefined,
    userStatusName: "",
    userType: undefined,
    userTypeName: ""
  });

  // 查询数据
  useEffect(() => {
    const pathHash = history.location;
    const { query } = pathHash;
    getUserPage(_assign({}, pageInfo, query));
  }, []);

  // 获取初始用户数据
  useEffect(() => {
    const tmpArr: SysUserDetail[] = [];
    userInfoList.forEach((item: SysUserDetail, index: number) => {
      if(index === 0){
        item.checked = true;
        setCheckUserId(item.userId);
        setCheckedUserInfo(item);
      }
      tmpArr.push(item);
    });
    setUserListData(tmpArr);
  }, [userInfoList]);


  // 构建列表对象
  useEffect(() => {
    initUserList();
  }, [userListData]);

  // 查询初始化列表为li元素
  const initUserList = () => {
    const arr: any[] = [];
    userListData.forEach(item => {
      arr.push(generatorItem(item))
    });
    setUserItemList(arr);
  };


  // 点击卡片执行的逻辑
  const checkNowLiItem = (checkUserId: string, clickCheck: boolean) => {
    if(clickCheck){
      return;
    }
    const tmpArr: SysUserDetail[] = [];
    userListData.forEach(item => {
      if(item.userId === checkUserId){
        item.checked = true
        setCheckedUserInfo(item);
      }else{
        item.checked = false
      }
      tmpArr.push(item);
    });
    setUserListData(tmpArr);
    setCheckUserId(checkUserId);
  };

  // 构造用户列表
  const generatorItem = (itemData: SysUserDetail) => {
    return <li key={itemData.userId} onClick={() => {checkNowLiItem(itemData.userId, itemData.checked)}}>
      <Card
        hoverable={!itemData.checked}
        className={itemData.checked ? styles.hoverOnLi : ''}
      >
        <Row>
          <Col span={12}>
            <div className={styles.ellipsis}>
              <Tooltip overlay={undefined} title={`用户名：${itemData.userName}`} color={Settings.primaryColor} key={Settings.primaryColor}>
                <UserOutlined />: <span className={itemData.checked ? styles.primaryColor : ''}>{itemData.userName}</span>
              </Tooltip>
            </div>
            <div className={styles.ellipsis}>
              <Tooltip overlay={undefined} title={`用户id：${itemData.userId}`} color={Settings.primaryColor} key={Settings.primaryColor}>
                <IdcardOutlined />: <span className={itemData.checked ? styles.primaryColor : ''}>{itemData.userId}</span>
              </Tooltip>
            </div>
            <div className={styles.ellipsis}>
              <Tooltip overlay={undefined} title={`角色数量：${itemData.roleCount}`} color={Settings.primaryColor} key={Settings.primaryColor}>
                <UsergroupAddOutlined />: <span className={itemData.checked ? styles.primaryColor : ''}>{itemData.roleCount}</span>
              </Tooltip>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.timeDiv}>
              <span className={styles.timeText}>创建时间:&nbsp;</span>
              <span className={styles.time}>{itemData.createDate || '初始化数据'}</span>
            </div>
            <div className={styles.timeDiv}>
              <span className={styles.timeText}>最近登录:&nbsp;</span>
              <span className={styles.time}>{itemData.lastLoginTime || '从未登录'}</span>
            </div>
          </Col>
        </Row>
      </Card>
    </li>
  };

  const onQueryFinish = (values: any) => {
    getUserPage(_assign(pageInfo, values));
  };

  const handleUserPageChange = (page: number, pageSize?: number) => {
    const pageNowInfo = {
      page,
      pageSize: pageSize || pageInfo.pageSize
    };
    setPageInfo(pageNowInfo);
    getUserPage(_assign(pageNowInfo, userQueryForm.getFieldsValue()));
  };

  return (
    <PageContainer fixedHeader={true}>
      <Row>
        <Col md={{ span: 6 }} xs={{ span: 24 }} className={styles.userListDiv}>
          <Form
            {...formItemLayout}
            className={styles.queryForm}
            form={userQueryForm}
            name="userQueryForm"
            onFinish={onQueryFinish}
          >
            <Row justify="space-around" align="middle">
              <Col md={12} xs={24}>
                <Form.Item
                  name='userName'
                  label='用户名'
                >
                  <Input placeholder='请输入用户名查询' />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name='userId'
                  label='用户id'
                >
                  <Input placeholder='请输入用户id查询' />
                </Form.Item>
              </Col>
              <Col md={24} xs={24} style={{textAlign: 'left'}}>
                <Space size="small">
                  <Button size='small' type='primary' htmlType="submit" loading={loading}>查询</Button>
                  <Button size='small' type='default' onClick={() => {
                    userQueryForm.resetFields();
                    getUserPage(_assign(pageInfo, userQueryForm.getFieldsValue()));
                  }} loading={loading}
                  >
                    重置
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
          {
            hasError ? null :
              <div style={{padding: '10px', textAlign: 'center'}}>
                <Row>
                  <Col md={4} xs={0} />
                  <Col md={16} xs={24}>
                    <Pagination size="small" total={totalElements} current={pageInfo.page} pageSize={pageInfo.pageSize} showSizeChanger={false} onChange={handleUserPageChange}  />
                  </Col>
                  <Col md={4} xs={24}>
                    共计{totalElements}人
                  </Col>
                </Row>

              </div>
          }
          <div className={styles.listDiv}>
            {
              loading ? <ProSkeleton active type='result' />
              : hasError ? <Result
                  status="error"
                  title={errorMessage}
                />
                :
                <QueueAnim component="ul" type={['right', 'left']} leaveReverse>
                  {
                    userItemList.length > 0 ? userItemList :
                      <Result
                        key='noDataResult'
                        status="404"
                        title="无数据"
                        subTitle="没有找到符合条件的数据"
                      />
                  }
                </QueueAnim>
            }
          </div>
        </Col>


        <Col md={{ span: 17, offset: 1 }} xs={{ span: 24 }} className={styles.userListDiv}>
          <div className={styles.listDiv}>
            <UserRoleDetail
              checkedUserId={checkedUserId}
              checkedUserInfo={checkedUserInfo}
            />
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default UserRole;
