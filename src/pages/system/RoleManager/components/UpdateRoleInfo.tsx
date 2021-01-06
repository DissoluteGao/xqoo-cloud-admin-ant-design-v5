import React, {useEffect, useState} from "react";
import {RoleDetailInfo, TipsInfo} from "@/pages/system/RoleManager/data";
import {Button, Col, Form, Input, message, Modal, Result, Row, Tooltip, TreeSelect} from "antd";
import {getServerRoleDetail, updateRoleInfo} from "@/pages/system/RoleManager/service";
import FormRoleDetailInfo from "@/pages/system/RoleManager/classIndex";
import {RetweetOutlined} from "@ant-design/icons";
import {assign as _assign} from "lodash";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import ParentMenuSelectTree from "@/pages/system/MenuManager/components/ParentMenuSelectTree";
import {SaveOutlined} from "@ant-design/icons/lib";

export interface UpdateRoleInfoProps {
  roleId?: number|string|undefined;
  showModal: boolean;
  titleText?: string;
  modalWidth?: string|number;
  footer?: any;
  maskClosable?: boolean;
  onCloseModal: () => void;
  onOkModal: (status: number, msg: string) => void;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
  },
};

const UpdateRoleInfo: React.FC<UpdateRoleInfoProps> = (props) => {
  const {roleId, showModal, titleText, modalWidth, footer, maskClosable, onCloseModal, onOkModal} = props;
  const [roleInfoForm] = Form.useForm();
  const [roleDetailInfo, setRolDetailInfo] = useState<RoleDetailInfo | undefined>(undefined);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [superAdmin, setSuperAdmin] = useState<boolean>(false);
  const [queryDataFail, setQueryDataFail] = useState<boolean>(false);
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [cannotEdit, setCannotEdit] = useState<boolean>(false);
  const [tipsInfoState, setTipsInfoState] = useState<TipsInfo>({title: '请稍后...', content: '正在查询中,请耐心等待.', type: "info", showBtn: false });
  const [roleMenuList, setRoleMenuList] = useState<string[] | number[] | undefined>([]);

  const initComponents = (roleId: number | string | undefined) => {
    setHasChange(false);
    if(roleId){
      setLoadingData(true);
      setQueryDataFail(true);
      setTipsInfoState({title: '查询中...', content: '正在查询，请稍后...', type: "info", showBtn: false});
      getServerRoleDetail(roleId).then(res => {
        setLoadingData(false)
        if(res.code === 200){
          setQueryDataFail(false);
          setRolDetailInfo(res.data);
          setRoleMenuList(res.data?.roleMenuList);
          initFormValue(res.data);
        }else{
          setRoleMenuList([]);
          setTipsInfoState({title: '查询发生错误', content: res.message, type: "error", showBtn: false});
        }
      }).catch(e => {
        setRoleMenuList([]);
        console.error('获取角色明细出错', e);
        setTipsInfoState({title: '查询发生错误', content: '查询数据发生了错误', type: "error", showBtn: false});
      })
    }else{
      setRoleMenuList([]);
      initFormValue(undefined);
    }
  };

  const initFormValue = (formDetailInfo: RoleDetailInfo | undefined) => {
    const formObj = new FormRoleDetailInfo(formDetailInfo).formRoleDetailInfo();
    if(formObj?.admin){
      setCannotEdit(true);
      setSuperAdmin(true);
      setQueryDataFail(true);
      setTipsInfoState({title: '警告', content: '当前角色为超级管理员，无法编辑，请切换其他角色', type: "warning", showBtn: false});
    }else{
      if(formObj?.id){
        setCannotEdit(true);
      }else{
        setCannotEdit(false);
      }
      setSuperAdmin(false);
      setQueryDataFail(false);
      roleInfoForm.setFieldsValue(formObj);
    }
  };

  useEffect(() => {
    roleInfoForm.resetFields();
    initComponents(roleId);
  },[roleId]);

  // 通用返回结果界面
  const renderDetailRight = () => {
    return <Result
      status={tipsInfoState.type}
      title={tipsInfoState.title}
      subTitle={tipsInfoState.content}
      extra={
        tipsInfoState.showBtn ?
          <Button type="primary" icon={<RetweetOutlined />} danger loading={loadingData} disabled={superAdmin}>重试</Button>
          : null
      }
    />
  };

  // 表单字段变动
  const onRoleValuesChange = (changedValues: any, allValues: any) => {
    if(!roleDetailInfo){
      setHasChange(true);
      return;
    }
    if(FormValueDiffOrigin(changedValues, allValues, roleDetailInfo)){
      setHasChange(false);
    }else{
      setHasChange(true);
    }
  };

  // 表单提交
  const onFinish = (values: any) => {
    let submitObj: RoleDetailInfo;
    if(roleId){
      submitObj = _assign({}, roleDetailInfo, values);
    }else{
      submitObj = _assign({}, new FormRoleDetailInfo(undefined).formRoleDetailInfo(), values)
    }
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: () => {
        updateToServer(submitObj);
      },
    });
  };

  const updateToServer = (value: RoleDetailInfo) => {
    setLoadingData(true);
    updateRoleInfo(value).then(res => {
      setLoadingData(false);
      onOkModal(res.code, res.message);
    }).catch(e => {
      setLoadingData(false);
      message.error('提交信息失败，请稍后重试');
      console.error('submit roleInfo error!', e);
    });
  };

  const roleMenuListChange = (value: any) => {
    setRoleMenuList(value);
    roleInfoForm.setFieldsValue({
      roleMenuList: value,
    });
  };

  return (
    <Modal
      key='roleDetail'
      title={titleText || '新增角色'}
      visible={showModal}
      width={modalWidth || '40%'}
      footer={footer || null}
      maskClosable={maskClosable}
      onCancel={() => {
        onCloseModal();
      }}
      onOk={onFinish}
    >
      {
        queryDataFail ?
          renderDetailRight()
          :
          <Form
            {...formItemLayout}
            form={roleInfoForm}
            name="basicRole"
            validateMessages={ValidateMessages}
            onValuesChange={onRoleValuesChange}
            onFinish={onFinish}
          >
            <Form.Item
              name="roleKey"
              label='角色标识'
              tooltip={<Tooltip title=''>
                此值作为角色唯一标识，不可重复<br />
                例: super:admin
              </Tooltip>}
              rules={[
                { required: true}]}
            >
              <Input disabled={cannotEdit} />
            </Form.Item>
            <Form.Item
              name="roleName"
              label='角色名称'
              tooltip={<Tooltip title=''>
                作为展示角色中文名显示<br />
                例: 超级管理员
              </Tooltip>}
              rules={[
                { required: true}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="roleMenuList"
              label='菜单权限'
              tooltip={<Tooltip title=''>
                选择该角色所包含的菜单权限<br />
                例: 超级管理员
              </Tooltip>}
              >
              <ParentMenuSelectTree
                onChange={roleMenuListChange}
                initValue={roleMenuList || []}
                nowValue={roleMenuList}
                widthStr='100%'
                canCheckable
                canCheckedStrategy={TreeSelect.SHOW_ALL}
                loading={loadingData}
                disabledForm={false}
              />
            </Form.Item>
            <Row>
              <Col md={7} xs={3}/>
              <Col md={3} xs={8} style={{textAlign: 'right'}}>
                <Button shape="round" icon={<SaveOutlined />} type="primary" htmlType="submit" disabled={!hasChange} loading={loadingData}>
                  {
                    roleDetailInfo?.id ? '保存' : '新增'
                  }
                </Button>
              </Col>
              {
                hasChange ? <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
                    <Button shape="round" type="default" loading={loadingData} onClick={() => {
                      initFormValue(roleDetailInfo);
                      setRoleMenuList(roleDetailInfo?.roleMenuList);
                      setHasChange(false);
                    }}>还原更改</Button>
                  </Col>
                  :
                  null
              }
              <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
                <Button shape="round" type="default" loading={loadingData} onClick={() => {
                  onCloseModal();
                }}>取消</Button>
              </Col>
            </Row>
          </Form>
      }
    </Modal>
  );
};
export default UpdateRoleInfo;
