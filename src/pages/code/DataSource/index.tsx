import {useModel} from "@@/plugin-model/useModel";
import React, {ReactNode, useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Alert, Button, Col, Divider, Form, Input, Modal, Result, Row, Select, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {DataSourceInfo, QueryDataSourceInfo} from "@/pages/code/DataSource/data";
import {FileAddOutlined} from "@ant-design/icons";
import styles from "./index.less";
import DataSourceInfoDetail from "@/pages/code/DataSource/components/DataSourceInfoDetail";

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

const DataSource: React.FC<{}> = () => {
  const { dataSourceList, dataSourceType, totalElements,
    loading, hasError, errorMessage, alertTipsShow, alertTipsMessage, alertTipsType, getDataSourceFromServer, getDataSourceTypeFromServer, deleteDataSourceToServer, alertTipsHandle} = useModel('code.DataSource.DataSourceInfoModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryDataSourceInfo>({page: 1, pageSize: 20});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkDataSourceInfo, setCheckDataSourceInfo] = useState<DataSourceInfo|undefined>(undefined);

  useEffect(() => {
    getDataSourceFromServer(queryParams);
    getDataSourceTypeFromServer();
  }, []);

  const columns: ColumnsType<DataSourceInfo> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '数据源类型',
      dataIndex: 'dataBaseType',
      align: 'center',
      ellipsis: true,
      render: (dataBaseType: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={dataBaseType}>
          {dataBaseType}
        </Tooltip>
      ),
    },
    {
      title: '名称',
      dataIndex: 'dataBaseShowName',
      align: 'center',
      ellipsis: true,
      render: (dataBaseShowName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={dataBaseShowName}>
          {dataBaseShowName}
        </Tooltip>
      ),
    },
    {
      title: '数据源地址',
      dataIndex: 'dataBaseHost',
      align: 'center',
      ellipsis: true,
      render: (dataBaseHost: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={dataBaseHost}>
          {dataBaseHost}
        </Tooltip>
      ),
    },
    {
      title: '数据源端口',
      dataIndex: 'dataBasePort',
      align: 'center',
      ellipsis: true,
      render: (dataBasePort: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={dataBasePort}>
          {dataBasePort}
        </Tooltip>
      ),
    },
    {
      title: '数据库名',
      dataIndex: 'dataBaseName',
      align: 'center',
      ellipsis: true,
      render: (dataBaseName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={dataBaseName}>
          {dataBaseName}
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      align: 'center',
      ellipsis: true,
      render: (createDate: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={createDate}>
          {createDate}
        </Tooltip>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      align: 'center',
      ellipsis: true,
      render: (createBy: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={createBy}>
          {createBy}
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
          <a onClick={ () => {updateDataSource(row)}}>编辑</a>
          <a onClick={ async () => {deleteDataSource(row.id)}}>删除</a>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getDataSourceFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getDataSourceFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };

  const dataSourceTypeGen = (): ReactNode[] => {
    const arr: ReactNode[] = [];
    dataSourceType.forEach(item => {
      arr.push(
        <Select.Option key={item.type} value={item.type}>{item.type}</Select.Option>
      );
    })
    return arr;
  };

  const updateDataSource = (dataSource?: DataSourceInfo) => {
    if(dataSource){
      setCheckDataSourceInfo(dataSource);
    }else{
      setCheckDataSourceInfo(undefined);
    }
    setShowModal(true);
  };

  const deleteDataSource = async (id: number) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确定操作',
      content: '是否确认删除数据？',
      onOk: () => {
        deleteDataSourceToServer(id).then(res => {
          if(res){
            getDataSourceFromServer(_assign(queryParams, queryForm.getFieldsValue()))
          }
        }).catch(e => {
          console.error('[delete dataSource error!]', e)
        });
      },
    });
  };

  const closeModal = (result: boolean) => {
    setShowModal(false);
    if(result){
      getDataSourceFromServer(_assign(queryParams, queryForm.getFieldsValue()))
    }
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
                label="数据源类型"
                name="dataBaseType">
                <Select allowClear placeholder="请选择类型">
                  { dataSourceTypeGen() }
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="数据源地址"
                name="dataBaseHost">
                <Input placeholder="请输入数据源地址，支持右模糊查询" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="数据源名字"
                name="dataBaseShowName">
                <Input placeholder="请输入数据源名字，支持模糊查询" />
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
      <div style={{marginTop: '15px'}}>
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
      </div>
      <div className={styles.tableDiv}>
        <Button type="primary" loading={loading} icon={<FileAddOutlined />} onClick={() => {updateDataSource()}}>新增数据源</Button>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<DataSourceInfo>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={dataSourceList}
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
      <DataSourceInfoDetail dataSourceInfo={checkDataSourceInfo} onCloseModal={closeModal} showModal={showModal} maskClosable={false}/>
    </PageContainer>
  );
};

export default DataSource;
