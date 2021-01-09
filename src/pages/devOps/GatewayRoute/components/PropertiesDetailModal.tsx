import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, Modal, Row, Tooltip} from "antd";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined} from "@ant-design/icons/lib";

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


export interface PropertiesDetailModalProps {
  titleText?: string;
  showModal: boolean;
  modalWidth?: string | number;
  footer?: any;
  maskClosable: boolean;
  contentObj: { keyValue: string, value: string, type: string; parentIndex: any, handleType: 'predicate'|'filter'}|undefined;
  onCloseModal: (success: boolean) => void;
  onSubmitValue: (obj: { keyValue: string, value: string, parentIndex: any, handleType: 'predicate'|'filter'}) => void;
}

const PropertiesDetailModal: React.FC<PropertiesDetailModalProps> = (props) => {
  const {titleText, showModal, contentObj, maskClosable, modalWidth, footer, onCloseModal, onSubmitValue } = props;
  const [disabledKey, setDisabledKey] = useState<boolean>(false);
  const [propertiesDetailForm] = Form.useForm();

  const initFormValue = () => {
    if(contentObj?.type === 'args'){
      setDisabledKey(true);
    }else{
      setDisabledKey(false);
    }
    propertiesDetailForm.setFieldsValue({
      keyValue: contentObj?.keyValue,
      value: contentObj?.value
    });
  };

  useEffect(() => {
    if(contentObj && contentObj.type){
      initFormValue();
    }
  }, [contentObj]);

  // 表单提交
  const onFinish = (values: any) => {
    const obj: { keyValue: string, value: string, parentIndex: any, handleType: 'predicate'|'filter'} = {
      keyValue: values.keyValue,
      value: values.value,
      parentIndex: contentObj?.parentIndex,
      handleType: contentObj?.handleType || 'predicate'
    };
    onSubmitValue(obj);
  };

  return (
    <Modal
      key='userInfo'
      visible={showModal}
      title={titleText || '新增角色'}
      maskClosable={maskClosable}
      width={modalWidth || '40%'}
      footer={footer || null}
      onCancel={() => {
        propertiesDetailForm.resetFields();
        onCloseModal(false);
      }}
    >
      <Form
        {...formItemLayout}
        form={propertiesDetailForm}
        name="propertiesDetailForm"
        validateMessages={ValidateMessages}
        onFinish={onFinish}
      >
        <Form.Item
          name="keyValue"
          label='参数键'
          tooltip={<Tooltip title=''>
            参数的key值
          </Tooltip>}
          rules={[
            { required: true}
          ]}
        >
          <Input disabled={disabledKey} />
        </Form.Item>

        <Form.Item
          name="value"
          label='参数值'
          tooltip={<Tooltip title=''>
            参数的值
          </Tooltip>}
          rules={[
            { required: true}]}
        >
          <Input />
        </Form.Item>

        <Row style={{marginTop: '10px'}}>
          <Col md={7} xs={3}/>
          <Col md={3} xs={8} style={{textAlign: 'right'}}>
            <Button shape="round" icon={<SaveOutlined />} type="primary" htmlType="submit">保存</Button>
          </Col>
          <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
            <Button shape="round" type="default"onClick={() => {
              propertiesDetailForm.resetFields();
              onCloseModal(false);
            }}>取消</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PropertiesDetailModal;
