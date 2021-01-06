import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Badge, Button, Col, Divider, Form, Input, Modal, Result, Row, Select, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {OperationLog, QueryOperationLog} from "@/pages/devOps/OperationLog/data";
import {SysUserStatusEnum} from "@/pages/system/UserManager/enums";
import {Prism} from 'react-syntax-highlighter';
import {duotoneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  const { operationLogList, totalElements, loading, hasError, errorMessage, getOperLog, operatorData, getOperatorData} = useModel('devOps.OperationLog.OperationLogModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryOperationLog>({page: 1, pageSize: 20});
  const [showDetailData, setShowDetailData] = useState<boolean>(false);

  useEffect(() => {
    getOperLog(queryParams);
  }, []);


  const getOperationData = (logId: string, type: 'request'|'response') => {
    getOperatorData(logId, type);
    setShowDetailData(true);
  };

  const columns: ColumnsType<OperationLog> = [
    {
      title: '记录id',
      dataIndex: 'logId',
      width: 100,
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      render: (logId: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={logId}>
          {logId}
        </Tooltip>
      ),
    },
    {
      title: '操作状态',
      dataIndex: 'operationStatusName',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, row, index) => {
        if(row.operationStatus === SysUserStatusEnum.NORMAL) {
          return <Badge color='green' text={text} />
        }else{
          return <Badge color='red' text={text} />
        }
      }
    },
    {
      title: '操作类型',
      dataIndex: 'operationTypeName',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (operationTypeName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={operationTypeName}>
          {operationTypeName}
        </Tooltip>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (operatorName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={operatorName}>
          {operatorName}
        </Tooltip>
      ),
    },
    {
      title: '调用方式',
      dataIndex: 'requestMethod',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (requestMethod: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={requestMethod}>
          {requestMethod}
        </Tooltip>
      ),
    },
    {
      title: '调用包名',
      dataIndex: 'methodName',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (methodName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={methodName}>
          {methodName}
        </Tooltip>
      ),
    },
    {
      title: '调用接口',
      dataIndex: 'requestUrl',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (requestUrl: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={requestUrl}>
          {requestUrl}
        </Tooltip>
      ),
    },
    {
      title: '操作简述',
      dataIndex: 'tipsMessage',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (tipsMessage: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={tipsMessage}>
          {tipsMessage}
        </Tooltip>
      ),
    },
    {
      title: '调用时间',
      dataIndex: 'createTime',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (createTime: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={createTime}>
          {createTime}
        </Tooltip>
      ),
    },
    {
      title: '操作来源',
      dataIndex: 'loginSourceName',
      align: 'center',
      ellipsis: true,
      width: 130,
      render: (loginSourceName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={loginSourceName}>
          {loginSourceName}
        </Tooltip>
      ),
    },
    {
      title: '操作ip',
      dataIndex: 'operatorRemoteIp',
      align: 'center',
      ellipsis: true,
      width: 140,
      render: (operatorRemoteIp: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={operatorRemoteIp}>
          {operatorRemoteIp}
        </Tooltip>
      ),
    },
    {
      title: '操作人id',
      dataIndex: 'operatorId',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (operatorId: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={operatorId}>
          {operatorId}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (text, row, index) => (
        <Space size="small">
          {
            row.hasRequestData ? <a onClick={ async () => {getOperationData(row.logId, 'request')}}>请求参数</a>
              : null
          }
          {
            row.hasResponseData ? <a onClick={() => {getOperationData(row.logId, 'response')}}>响应参数</a>
              : null
          }
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getOperLog(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getOperLog(_assign(pageNowInfo, queryForm.getFieldsValue()));
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
                label="操作人id"
                name="operatorId">
                <Input placeholder="操作人id" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="操作人"
                name="operatorName">
                <Input placeholder="操作人用户名，支持模糊查询" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="操作接口"
                name="requestUrl">
                <Input placeholder="操作接口路径，支持右模糊查询" />
              </Form.Item>
            </Col>
            <Col md={9} xs={0}/>
            <Col md={5} xs={24}>
              <Form.Item
                label="请求方式"
                name="requestMethod">
                <Select allowClear placeholder="请选择请求方式">
                  <Select.Option value="POST">POST</Select.Option>
                  <Select.Option value="GET">GET</Select.Option>
                  <Select.Option value="DELETE">DELETE</Select.Option>
                  <Select.Option value="PUT">PUT</Select.Option>
                  <Select.Option value="CONNECT">CONNECT</Select.Option>
                  <Select.Option value="TRACE">TRACE</Select.Option>
                  <Select.Option value="HEAD">HEAD</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="操作类型"
                name="operationType">
                <Select allowClear placeholder="请选择请求方式">
                  <Select.Option value={1}>查询</Select.Option>
                  <Select.Option value={2}>新增</Select.Option>
                  <Select.Option value={3}>修改</Select.Option>
                  <Select.Option value={4}>删除</Select.Option>
                  <Select.Option value={0}>其他</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="操作状态"
                name="operationStatus">
                <Select allowClear placeholder="请选择状态">
                  <Select.Option value={0}>成功</Select.Option>
                  <Select.Option value={1}>失败</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={9} xs={0}/>
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
            <Table<OperationLog>
              size="small"
              columns={columns}
              rowKey={record => record.logId}
              dataSource={operationLogList}
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
      <Modal
        width={800}
        bodyStyle={{ padding: '32px 40px 48px'}}
        destroyOnClose
        title="参数json"
        visible={showDetailData}
        footer={null}
        maskClosable={false}
        onCancel={() => {
          setShowDetailData(false);
        }}
      >
        <div className={[`${styles.jsonDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
          {
            (operatorData && operatorData !== '[]') ?
            <Prism
              showLineNumbers
              startingLineNumber={1}
              language="json"
              wrapLines
              style={duotoneDark}
            >
              {operatorData}
            </Prism>
            :
            <Result
              status="info"
              title="无数据"
              subTitle="抱歉，当前操作没有数据"
            />
          }

        </div>
      </Modal>
    </PageContainer>
  );
};

export default UserLoginHistory;
