import {useModel} from "@@/plugin-model/useModel";
import {GatewayInterceptQuery, GatewayInterceptResult} from "@/pages/devOps/GatewayIntercept/data";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Button, Col, Divider, Form, Input, Result, Row, Select, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import styles from "@/pages/system/UserManager/index.less";

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

const GatewayIntercept: React.FC<{}> = () => {
  const { interceptLog, totalElements, loading, hasError, errorMessage, getInterceptLog} = useModel('devOps.GatewayIntercept.GatewayInterceptModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<GatewayInterceptQuery>({page: 1, pageSize: 20});

  useEffect(() => {
    getInterceptLog(queryParams);
  }, []);

  const columns: ColumnsType<GatewayInterceptResult> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '拦截类型',
      dataIndex: 'interceptTypeName',
      align: 'center',
      ellipsis: true,
      render: (interceptType: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={interceptType}>
          {interceptType}
        </Tooltip>
      ),
    },
    {
      title: '请求ip',
      dataIndex: 'requestIp',
      align: 'center',
      ellipsis: true,
      render: (requestIp: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={requestIp}>
          {requestIp}
        </Tooltip>
      ),
    },
    {
      title: '请求端口',
      dataIndex: 'requestPort',
      align: 'center',
      ellipsis: true,
      render: (requestPort: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={requestPort}>
          {requestPort}
        </Tooltip>
      ),
    },
    {
      title: '目标地址',
      dataIndex: 'requestUrl',
      align: 'center',
      ellipsis: true,
      render: (requestUrl: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={requestUrl}>
          {requestUrl}
        </Tooltip>
      ),
    },
    {
      title: '拦截时间',
      dataIndex: 'interceptTime',
      align: 'center',
      ellipsis: true,
      render: (interceptTime: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={interceptTime}>
          {interceptTime}
        </Tooltip>
      ),
    }
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getInterceptLog(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getInterceptLog(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };

  return (
    <PageContainer fixedHeader>
      <div className={styles.operationDiv}>
        <Form
          {...formItemLayout}
          form={queryForm}
          name="interceptQueryForm"
          onFinish={onFinish}
        >
          <Row justify="space-around" align="middle">
            <Col md={5} xs={24}>
              <Form.Item
                label="拦截类型"
                name="interceptType">
                <Select allowClear placeholder="请选择状态">
                  <Select.Option value="REMOTE">来源拦截</Select.Option>
                  <Select.Option value="TARGET">目标拦截</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="请求ip"
                name="requestIp">
                <Input placeholder="请输入用户注册名，模糊匹配" />
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
            <Table<GatewayInterceptResult>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={interceptLog}
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

export default GatewayIntercept;
