import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Button, Col, Divider, Form, Input, Result, Row, Select, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {UserLoginHistoryQuery, UserLoginHistoryResult} from "@/pages/devOps/UserLoginHistory/data";
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

const UserLoginHistory: React.FC<{}> = () => {
  const { userHistoryList, totalElements, loading, hasError, errorMessage, getLoginHistory} = useModel('devOps.UserLoginHistory.UserLoginHistoryModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<UserLoginHistoryQuery>({page: 1, pageSize: 20});

  useEffect(() => {
    getLoginHistory(queryParams);
  }, []);

  const columns: ColumnsType<UserLoginHistoryResult> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '登录用户id',
      dataIndex: 'userId',
      align: 'center',
      ellipsis: true,
      render: (userId: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={userId}>
          {userId}
        </Tooltip>
      ),
    },
    {
      title: '登录ip',
      dataIndex: 'loginIp',
      align: 'center',
      ellipsis: true,
      render: (loginIp: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={loginIp}>
          {loginIp}
        </Tooltip>
      ),
    },
    {
      title: '登录模式',
      dataIndex: 'loginTypeName',
      align: 'center',
      ellipsis: true,
      render: (loginTypeName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={loginTypeName}>
          {loginTypeName}
        </Tooltip>
      ),
    },
    {
      title: '登录环境',
      dataIndex: 'loginEnv',
      align: 'center',
      ellipsis: true,
      render: (loginEnv: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={loginEnv}>
          {loginEnv}
        </Tooltip>
      ),
    },
    {
      title: '登录来源',
      dataIndex: 'loginSourceName',
      align: 'center',
      ellipsis: true,
      render: (loginSourceName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={loginSourceName}>
          {loginSourceName}
        </Tooltip>
      ),
    },
    {
      title: '登录时间',
      dataIndex: 'loginDate',
      align: 'center',
      ellipsis: true,
      render: (loginDate: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={loginDate}>
          {loginDate}
        </Tooltip>
      ),
    }
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getLoginHistory(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getLoginHistory(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };

  return (
    <PageContainer fixedHeader>
      <div className={styles.operationDiv}>
        <Form
          {...formItemLayout}
          form={queryForm}
          name="loginHistoryQueryForm"
          onFinish={onFinish}
        >
          <Row justify="space-around" align="middle">
            <Col md={5} xs={24}>
              <Form.Item
                label="登录ip"
                name="loginIp">
                <Input placeholder="请输入登录ip，支持右半模糊匹配" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="用户id"
                name="userId">
                <Input placeholder="请输入用户id匹配" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="登录模式"
                name="loginType">
                <Select allowClear placeholder="请选择模式">
                  <Select.Option value="PASSWORD">账号密码模式</Select.Option>
                  <Select.Option value="QRCODE">二维码扫码模式</Select.Option>
                  <Select.Option value="PHONE">短信验证码模式</Select.Option>
                  <Select.Option value="EMAIL">邮件验证码模式</Select.Option>
                  <Select.Option value="FINGER">指纹模式</Select.Option>
                  <Select.Option value="FACE">面部识别模式</Select.Option>
                  <Select.Option value="IDENTIFY">证件扫描模式</Select.Option>
                  <Select.Option value="THIRDPARTY">第三方登录</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="登录来源"
                name="loginSource">
                <Select allowClear placeholder="请选择来源">
                  <Select.Option value="PcBrowser">浏览器</Select.Option>
                  <Select.Option value="PcClient">电脑客户端</Select.Option>
                  <Select.Option value="APP">手机app</Select.Option>
                  <Select.Option value="WeChat">公众号</Select.Option>
                  <Select.Option value="SmallProgram">小程序</Select.Option>
                  <Select.Option value="UnKnow">未知来源</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={14} xs={0}/>
            <Col md={2} xs={8} style={{textAlign: 'left'}}>
              <Space size="large">
                <Button type='primary' htmlType="submit" loading={loading}>查询</Button>
                <Button type='default' loading={loading} onClick={() => { queryForm.resetFields()}}>重置</Button>
              </Space>
            </Col>
            <Col md={17} xs={0} />
          </Row>
        </Form>
      </div>
      <div className={styles.tableDiv}>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<UserLoginHistoryResult>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={userHistoryList}
              pagination={{
                size: 'small',
                total: totalElements,
                current: queryParams.page,
                pageSize: queryParams.pageSize,
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
    </PageContainer>
  );
};

export default UserLoginHistory;
