import {Button, Col, Form, Input, Modal, Row, Select, Tooltip} from "antd";
import React from "react";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined} from "@ant-design/icons/lib";
import {useModel} from "@@/plugin-model/useModel";
import {AddUserInfoParam} from "@/pages/system/UserManager/data";

export interface UserDetailInfoFormProps {
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

const UserDetailInfoForm: React.FC<UserDetailInfoFormProps> = (props) => {
  const {titleText, showModal, modalWidth, footer, maskClosable, onCloseModal} = props;
  const {loading, AddUserInfo} = useModel('system.UserManager.userInfoModel');
  const [userDetailInfoForm] = Form.useForm();

  // 表单提交
  const onFinish = (values: AddUserInfoParam) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: async () => {
        const success = await AddUserInfo(values);
        if(success){
          userDetailInfoForm.resetFields();
          onCloseModal(true);
        }else{
          onCloseModal(false);
        }
      },
    });
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
        userDetailInfoForm.resetFields();
        onCloseModal(false);
      }}
    >
      <Form
        {...formItemLayout}
        form={userDetailInfoForm}
        name="userInfoDetail"
        validateMessages={ValidateMessages}
        onFinish={onFinish}
      >
        <Form.Item
          name="loginId"
          label='登录id'
          hasFeedback
          tooltip={<Tooltip title=''>
            此值作为用户登录系统的默认账号，在没有其他登录方式时只可以此登录
          </Tooltip>}
          rules={[
            { required: true, min: 4, max: 32},
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
          name="userName"
          label='用户名'
          hasFeedback
          tooltip={<Tooltip title=''>
            此值作为用户中文标识，最大不可超过32字
          </Tooltip>}
          rules={[
            { required: true, min: 2, max: 32}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="userType"
          label='用户类型'
          tooltip={<Tooltip title=''>
            选择一个用户类型
          </Tooltip>}
          rules={[
            { required: true}]}
        >
          <Select placeholder="请选择用户类型">
            <Select.Option value={88}>控制台用户</Select.Option>
            <Select.Option value={10}>web端用户</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="password"
          label='密码'
          hasFeedback
          tooltip={<Tooltip title=''>
            请给用户指定一个初始密码
          </Tooltip>}
          rules={[
            { required: true, min: 6, max: 20}]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label='确认密码'
          dependencies={['password']}
          hasFeedback
          tooltip={<Tooltip title=''>
            请再输入以此密码
          </Tooltip>}
          rules={[
            { required: true,},
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次输入的密码不一致');
              },
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Row style={{marginTop: '10px'}}>
          <Col md={7} xs={3}/>
          <Col md={3} xs={8} style={{textAlign: 'right'}}>
            <Button shape="round" icon={<SaveOutlined />} type="primary" htmlType="submit" loading={loading}>保存</Button>
          </Col>
          <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
            <Button shape="round" type="default" loading={loading} onClick={() => {
              userDetailInfoForm.resetFields();
              onCloseModal(false);
            }}>取消</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserDetailInfoForm;
