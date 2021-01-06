import {DataSourceInfo} from "@/pages/code/DataSource/data";
import {useModel} from "@@/plugin-model/useModel";
import {Button, Col, Form, Input, message, Modal, Row, Select, Space, Tooltip} from "antd";
import React, {ReactNode, useEffect, useState} from "react";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined, LoadingOutlined, CheckCircleTwoTone, CloseCircleTwoTone} from "@ant-design/icons";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import {assign as _assign} from 'lodash';
import {aesEncode} from "@/utils/aes/aesUtil";


export interface DataSourceInfoDetailProps {
  dataSourceInfo?: DataSourceInfo;
  titleText?: string;
  showModal: boolean;
  modalWidth?: string | number;
  footer?: any;
  maskClosable: boolean;
  onCloseModal: (success: boolean) => void;
}

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

const DataSourceInfoDetail: React.FC<DataSourceInfoDetailProps> = (props) => {
  const {dataSourceInfo, titleText, showModal, modalWidth, footer, maskClosable, onCloseModal} = props;
  const {dataSourceType, loading, testConnectSuccess, testConnectLoading, testConnectMessage, testConnectError, testDataSource, resetTestConnect, updateDataSourceToServer} = useModel('code.DataSource.DataSourceInfoModel');
  const [updateForm] = Form.useForm();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const initFormInfoValue = () => {
    if(dataSourceInfo){
      updateForm.setFieldsValue(dataSourceInfo);
      setIsAdd(false);
    }else{
      updateForm.resetFields();
      setIsAdd(true);
    }
  };

  useEffect(() => {
    initFormInfoValue();
  }, [dataSourceInfo]);


  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if(!dataSourceInfo){
      setHasChange(true);
      return;
    }
    if(FormValueDiffOrigin(changedValues, allValues, dataSourceInfo)){
      setHasChange(false);
    }else{
      setHasChange(true);
    }
  };

  // 表单提交
  const onFinish = (values: DataSourceInfo) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: async () => {
        const obj: DataSourceInfo = _assign({}, dataSourceInfo, values);
        obj.dataBasePassword = aesEncode(obj.dataBasePassword);
        const success = await updateDataSourceToServer(obj);
        if(success){
          updateForm.resetFields();
          resetTestConnect();
          onCloseModal(true);
        }else{
          onCloseModal(false);
        }
      },
    });
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

  const testConnectActive = () => {

    updateForm.validateFields().then(res => {
      if(dataSourceInfo && dataSourceInfo.dataBasePassword === res.dataBasePassword){
        message.warning('已有数据源请重新输入连接密码测试连接');
        return;
      }
      const obj: DataSourceInfo = _assign({}, dataSourceInfo, res);
      obj.dataBasePassword = aesEncode(obj.dataBasePassword);
      testDataSource(obj, res.dataBaseType);
    });
  };

  return (
    <Modal
      key='userInfo'
      visible={showModal}
      title={titleText || (isAdd ? '新增数据源': '编辑数据源')}
      maskClosable={maskClosable}
      width={modalWidth || '40%'}
      footer={footer || null}
      onCancel={() => {
        resetTestConnect();
        onCloseModal(false);
      }}
    >
      <Form
        {...formItemLayout}
        form={updateForm}
        name="dataSourceDetail"
        validateMessages={ValidateMessages}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          name="dataBaseType"
          label='数据源类型'
          hasFeedback
          wrapperCol={{span: 6}}
          tooltip={<Tooltip title=''>
            选择一个数据源类型
          </Tooltip>}
          rules={[
            { required: true}
          ]}
        >
          <Select allowClear placeholder="请选择类型">
            { dataSourceTypeGen() }
          </Select>
        </Form.Item>

        <Form.Item
          name="dataBaseShowName"
          label='名称'
          hasFeedback
          wrapperCol={{span: 8}}
          tooltip={<Tooltip title=''>
            此值作为数据源中文标识，最大不可超过64字
          </Tooltip>}
          rules={[
            { required: true, min: 2, max: 64}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dataBaseHost"
          label='数据库地址'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            数据库连接地址，不能输入一些特殊符号
          </Tooltip>}
          rules={[
            { required: true, min: 2, max: 128},
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const pattern = new RegExp("[$%^&+=\\[\\]~！￥…*（）—{}【】‘；：”“’。，、？]")
                if (!value || !pattern.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject('不可输入特殊字符');
              },
            })
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dataBasePort"
          label='端口'
          hasFeedback
          wrapperCol={{span: 4}}
          tooltip={<Tooltip title=''>
            连接数据库的端口，不填的话将采用默认3306
          </Tooltip>}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dataBaseName"
          label='库名/schema'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            数据库库名，不能输入特殊字符
          </Tooltip>}
          rules={[
            { required: true, min: 2, max: 32},
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const pattern = new RegExp("[$%?^&+=\\[\\]~！￥…*（）—{}【】‘；：”“’。，、？]")
                if (!value || !pattern.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject('不可输入特殊字符');
              },
            })
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dataBaseProperties"
          label='连接属性'
          hasFeedback
          wrapperCol={{span: 10}}
          tooltip={<Tooltip title=''>
            可不填，不填将采用默认配置，例如时区，查询编码等参数
          </Tooltip>}
          rules={[
            { min: 2, max: 10},
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const pattern = new RegExp("[?\\[\\]？]")
                if (!value || !pattern.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject('不可输入特殊字符');
              },
            })
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dataBaseUserName"
          label='连接用户名'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            数据库连接用户名
          </Tooltip>}
          rules={[
            { required: true, min: 2, max: 256}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dataBasePassword"
          label='密码'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            数据库连接密码
          </Tooltip>}
          rules={[
            { required: true, min: 4, max: 256}]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label='测试连接'
          tooltip={<Tooltip title=''>
            点击测试连接是否正常
          </Tooltip>}
        >
          {
            testConnectLoading || testConnectSuccess ?
              <Space>
                  <span>
                    {
                      testConnectLoading ?
                        <LoadingOutlined />
                        :
                        testConnectError ?
                          <CloseCircleTwoTone twoToneColor="#aa2024" />
                          :
                          <CheckCircleTwoTone twoToneColor="#52c41a" />
                    }
                  </span>
                <span>{testConnectMessage}</span>
                {
                  testConnectSuccess ?
                  <span><a onClick={resetTestConnect}>重试</a></span>
                  : null
                }

              </Space>
                :
              <Button type="link" onClick={testConnectActive}>测试连接</Button>
          }
        </Form.Item>

        <Row style={{marginTop: '10px'}}>
          <Col md={7} xs={3}/>
          <Col md={3} xs={8} style={{textAlign: 'right'}}>
            <Button shape="round" icon={<SaveOutlined />} type="primary" htmlType="submit" disabled={!hasChange} loading={loading}>{isAdd ? '添加': '保存'}</Button>
          </Col>
          <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
            <Button shape="round" type="default" loading={loading} onClick={() => {
              resetTestConnect();
              onCloseModal(false);
            }}>取消</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DataSourceInfoDetail;
