import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {useModel} from "@@/plugin-model/useModel";
import {
  Alert,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Popconfirm,
  Result,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip
} from "antd";
import {GatewayRouteInfo, GatewayRouteQuery} from "@/pages/devOps/GatewayRoute/data";
import {assign as _assign} from "lodash";
import {ColumnsType} from "antd/es/table";
import {SysUserStatusEnum} from "@/pages/system/UserManager/enums";
import QueueAnim from "rc-queue-anim";
import {SyncOutlined, PlusOutlined} from "@ant-design/icons";
import {history} from "umi";
import styles from "@/pages/devOps/GatewayRoute/index.less";

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

const GatewayRoute: React.FC<{}> = () => {
  const { gatewayRouteInfoList, totalElements, loading, hasError, errorMessage,
    alertTipsShow, alertTipsMessage, alertTipsType, getRouteListFromServer, denyClientToServer, resetClientToServer, refreshRouteFromServer, alertTipsHandle} = useModel('devOps.GatewayRoute.GatewayRouteModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<GatewayRouteQuery>({page: 1, pageSize: 20});

  const jumpToUpdatePage = (id: string) => {
    console.log(id)
    history.push(`/devOps/gatewayRoute/updateGatewayRoute?routeId=${id}`);
  };

  const columns: ColumnsType<GatewayRouteInfo> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      render: (id: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={id}>
          {id}
        </Tooltip>
      ),
    },
    {
      title: '路由ID',
      dataIndex: 'serviceId',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (serviceId: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={serviceId}>
          {serviceId}
        </Tooltip>
      )
    },
    {
      title: '路由名称',
      dataIndex: 'serviceCname',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (serviceCname: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={serviceCname}>
          {serviceCname}
        </Tooltip>
      ),
    },
    {
      title: '服务类型',
      dataIndex: 'serviceType',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (text, row, index) => {
        if(row.serviceType === 'SYSTEM') {
          return <Tag color='#FFB978'>控制台服务</Tag>
        }else if(row.serviceType === 'CLIENT'){
          return <Tag color='#009E6E'>WEB前端服务</Tag>
        }else if(row.serviceType === 'TOOL'){
          return <Tag color='#FF004A'>工具类服务</Tag>
        }else{
          return <Tag color='red'>未知服务</Tag>
        }
      }
    },
    {
      title: '路由指向',
      dataIndex: 'uri',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (uri: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={uri}>
          {uri}
        </Tooltip>
      ),
    },
    {
      title: '排序',
      dataIndex: 'orderNo',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (orderNo: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={orderNo}>
          {orderNo}
        </Tooltip>
      ),
    },
    {
      title: '是否可用',
      dataIndex: 'serviceStatus',
      align: 'center',
      ellipsis: true,
      width: 160,
      render: (text, row, index) => {
        if(row.serviceStatus === SysUserStatusEnum.DENY) {
          return <Tag color='#108ee9'>启用</Tag>
        }else{
          return <Tag color='#f50'>未启用</Tag>
        }
      }
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (text, row, index) => (
        <Space size="small">
          <a onClick={ async () => { jumpToUpdatePage(String(row.id)) }}>编辑</a>
          {
            row.serviceStatus === 1 ?
              <Popconfirm placement="top" title='确认禁用？' onConfirm={() => denyRouteToServer(row.serviceId)} okText="确定" cancelText="取消">
                <a>禁用</a>
              </Popconfirm>
              : null
          }
          {
            row.serviceStatus === 0 ?
              <Popconfirm placement="top" title='确认启用？' onConfirm={() => resetRouteToServer(row.serviceId)} okText="确定" cancelText="取消">
                <a>启用</a>
              </Popconfirm>
              : null
          }
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getRouteListFromServer(queryParams);
  }, []);

  // 查询表单提交
  const onFinish = (values: any) => {
    getRouteListFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(_assign(pageNowInfo, queryForm.getFieldsValue()));
    getRouteListFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };

  // 禁用路由
  const denyRouteToServer = (serviceId: string) => {
    denyClientToServer({page: 0, pageSize: 0, serviceId}).then(res => {
      if(res){
        getRouteListFromServer(queryParams);
      }
    }).catch(e => {
      console.error('[deny Route Error]:', e);
    });
  };

  // 启用路由
  const resetRouteToServer = (serviceId: string) => {
    resetClientToServer({page: 0, pageSize: 0, serviceId}).then(res => {
      if(res){
        getRouteListFromServer(queryParams);
      }
    }).catch(e => {
      console.error('[reset Route Error]:', e);
    });
  };

  // 刷新路由
  const refreshGatewayRoute = () => {
    refreshRouteFromServer().then(res => {
      if(!res){
        console.warn('refreshRouteInfoErr');
      }
    }).catch(e => {
      console.error('refreshRouteInfoErr:', e);
    });
  };

  return (
    <PageContainer fixedHeader>
      <div className={styles.operationDiv}>
        <Form
          {...formItemLayout}
          form={queryForm}
          name="gatewayRouteQueryForm"
          onFinish={onFinish}
        >
          <Row justify="space-around" align="middle">
            <Col md={5} xs={24}>
              <Form.Item
                label="路由id"
                name="serviceId">
                <Input placeholder="请输入路由id" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="路由名称"
                name="serviceCname">
                <Input placeholder="路由名称，支持模糊查询" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="状态"
                name="serviceStatus">
                <Select allowClear placeholder="请选择路由状态">
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="1">可用</Select.Option>
                  <Select.Option value="0">不可用</Select.Option>
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
        <Space size="large">
          <Button type="primary" danger loading={loading} icon={<SyncOutlined />} onClick={refreshGatewayRoute}>推送路由</Button>
          <Button type="primary" loading={loading} icon={<PlusOutlined />} onClick={() => { jumpToUpdatePage('') }}>新增路由</Button>
        </Space>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<GatewayRouteInfo>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={gatewayRouteInfoList}
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
export default GatewayRoute;
