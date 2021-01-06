import {useModel} from "umi";
import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Result,
  Row,
  Select,
  Space,
  Table,
  Tooltip
} from "antd";
import {ColumnsType} from 'antd/es/table';
import {assign as _assign} from "lodash";
import {SysUserDetail} from "@/pages/system/UserManager/data";
import {SysUserStatusEnum} from "@/pages/system/UserManager/enums";
import UserDetailInfoForm from "@/pages/system/UserManager/components/UserDetailInfoForm";
import {UserAddOutlined} from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
import {history} from 'umi';
import styles from "./index.less";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 10 },
    sm: { span: 10 },
    md: { span: 13 },
  },
};



const SysUserManager: React.FC<{}> = () => {
  const { userInfoList, totalElements, loading, hasError, errorMessage, alertTipsShow, alertTipsMessage, alertTipsType, alertTipsHandle, getUserPage, delUser, changeUserStatus} = useModel('system.UserManager.userInfoModel');
  const [userInfoForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<{ page: number, pageSize: number}>({page:1, pageSize:20});
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  useEffect(() => {
    getUserPage({ page: 1, pageSize: 10});
  }, []);

  const delUserInfo = (userId: string) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: () => {
        delUser(userId).then(res => {
          if(res){
            getUserPage(_assign(pageInfo, userInfoForm.getFieldsValue()))
          }
        }).catch(e => {
          console.error('[delete user error!]', e)
        });
      },
    });

  };

  const changeStatus = (type: 'freeze'|'deny'|'unFreeze'|'unDeny', userId: string) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认执行此操作？',
      onOk: () => {
        changeUserStatus(type, userId).then((res: boolean) => {
          if(res){
            getUserPage(_assign(pageInfo, userInfoForm.getFieldsValue()))
          }
        }).catch((e: any) => {
          console.error('[update userStatus error!]', e)
        });
      },
    });
  };


  // 查询表单提交
  const onFinish = (values: any) => {
    getUserPage(_assign(pageInfo, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setPageInfo(pageNowInfo);
    getUserPage(_assign(pageNowInfo, userInfoForm.getFieldsValue()));
  };

  const openAddUser = () => {
    setShowAddModal(true);
  };

  const closeAddUser = (success: boolean) => {
    if(success){
      getUserPage(_assign(pageInfo, userInfoForm.getFieldsValue()));
    }
    setShowAddModal(false);
  };

  const columns: ColumnsType<SysUserDetail> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      align: 'center',
      fixed: 'left',
      width: 100,
      render: (avatar: any) => (
        <Avatar src={avatar || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} />
      ),
    },
    {
      title: '用户id',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (userId: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={userId}>
          {userId}
        </Tooltip>
      ),
    },
    {
      title: '账户id',
      dataIndex: 'loginId',
      key: 'loginId',
      align: 'center',
      ellipsis: true,
      render: (loginId: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={loginId}>
          {loginId}
        </Tooltip>
      ),
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      ellipsis: true,
      render: (userName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={userName}>
          {userName}
        </Tooltip>
      ),
    },
    {
      title: '用户类型',
      key: 'userTypeName',
      dataIndex: 'userTypeName',
      align: 'center',
      width: 130,
      ellipsis: true
    },
    {
      title: '用户状态',
      dataIndex: 'userStatusName',
      key: 'userStatusName',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (text, row, index) => {
        if(row.userStatus === SysUserStatusEnum.NORMAL) {
          return <Badge color='green' text={text} />
        }else if(row.userStatus === SysUserStatusEnum.DENY){
          return <Badge color='orange' text={text} />
        }else{
          return <Badge color='red' text={text} />
        }
      }
    },
    {
      title: '上次登录时间',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        if(!text || text.trim() === ''){
          return '从未登录';
        }
        return text;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '最近修改时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        if(!text || text.trim() === ''){
          return '从未修改';
        }
        return text;
      }
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 200,
      render: (text, row, index) => (
        <Space size="small">
          <a onClick={() => { history.push(`/system/userRole?userId=${row.userId}`) }}>角色</a>
          {
            row.userStatus === SysUserStatusEnum.NORMAL ?
              <>
                <a onClick={() => { changeStatus('deny', row.userId) }}>封锁</a>
                <a onClick={() => { changeStatus('freeze', row.userId)}}>停用</a>
              </>
              : null
          }
          {
            row.userStatus === SysUserStatusEnum.DENY ?
              <a onClick={() => { changeStatus('unDeny', row.userId)}}>解锁</a>
              : null
          }
          {
            row.userStatus === SysUserStatusEnum.FREEZE ?
              <a  onClick={() => { changeStatus('unFreeze', row.userId)}}>启用</a>
              : null
          }
          <a onClick={() => {delUserInfo(row.userId)}}>删除</a>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <div className={styles.operationDiv}>
        <Form
          {...formItemLayout}
          form={userInfoForm}
          name="userQueryForm"
          onFinish={onFinish}
        >
          <Row justify="space-around" align="middle">
            <Col md={5} xs={24}>
              <Form.Item
                label="用户登录id"
                name="loginId">
                <Input placeholder="请输入用户登录id，模糊匹配" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="用户名"
                name="userName">
                <Input placeholder="请输入用户注册名，模糊匹配" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="用户状态"
                name="userStatus">
                <Select allowClear placeholder="请选择状态">
                  <Select.Option value={0}>正常</Select.Option>
                  <Select.Option value={1}>封禁</Select.Option>
                  <Select.Option value={2}>停用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="用户类型"
                name="userType">
                <Select allowClear placeholder="请选择类型">
                  <Select.Option value={88}>后台用户</Select.Option>
                  <Select.Option value={10}>web用户</Select.Option>
                  <Select.Option value={9}>临时用户</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4} xs={0}/>
            <Col md={2} xs={8} style={{textAlign: 'left'}}>
              <Space size="large">
                <Button type='primary' htmlType="submit" loading={loading}>查询</Button>
                <Button type='default' loading={loading} onClick={() => { userInfoForm.resetFields()}}>重置</Button>
              </Space>
            </Col>
            <Col md={17} xs={0} />
          </Row>
        </Form>
      </div>
      <QueueAnim style={{ marginTop: '20px'}}
                 animConfig={[
                   { opacity: [1, 0], translateY: [0, 50] },
                   { opacity: [1, 0], translateY: [0, -50] }
                 ]}>
        {
          alertTipsShow ? <Alert
            message={alertTipsMessage}
            showIcon
            type={alertTipsType}
            closeText={<div
              onClick={() => {alertTipsHandle('info', '', false)}}>
              我知道了
            </div>
            }
          /> : null
        }
      </QueueAnim>
      <div className={styles.tableDiv}>
        <Button type="primary" loading={loading} icon={<UserAddOutlined />} onClick={openAddUser}>新增用户</Button>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<SysUserDetail>
              size="small"
              columns={columns}
              rowKey={record => record.userId}
              dataSource={userInfoList}
              pagination={{
                size: 'small',
                total: totalElements,
                current: pageInfo.page,
                pageSize: pageInfo.pageSize,
                pageSizeOptions: ['20','40'],
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => {return `总条数${total}条`},
              }}
              loading={loading}
              scroll={{ x: 900, scrollToFirstRowOnChange: true }}
              onChange={handleTableChange}
            />
        }
      </div>
      <UserDetailInfoForm showModal={showAddModal} maskClosable={false} onCloseModal={closeAddUser} />
    </PageContainer>
  );
};
export default SysUserManager;
