import {MenuDetailInfo, SimpleMenuInfo} from "@/pages/system/MenuManager/data";
import React, {ReactNodeArray, useEffect, useState} from "react";
import {
  Alert,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message, Modal, Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Tooltip,
} from "antd";
import {
  getFactAndNoRedirectMenuDetailInfo,
  getSimpleMenuInfo, removeMenuDetailInfo, updateMenuDataToServer
} from "@/pages/system/MenuManager/service";
import ParentMenuSelectTree from "@/pages/system/MenuManager/components/ParentMenuSelectTree";
import {DeleteOutlined, RedoOutlined, RollbackOutlined, SaveOutlined} from "@ant-design/icons";
import {loopFindMenuItem, loopMenuItem} from "@/utils/route/menuHandleTool";
import FormMenuDetailInfo from "@/pages/system/MenuManager/classIndex";
import {assign as _assign} from 'lodash';
import {MenuHeaderTheme, MenuLayOutEnum} from "@/pages/system/MenuManager/enums";
import NoParentMenuSelect from "@/pages/system/MenuManager/components/NoParentMenuSelect";
import {CustomIconMap} from "@/maps/IconMaps/CustomIconMap";
import IconModal from "@/components/IconUtil/IconModal";
import {ResponseData} from "@/services/PublicInterface";
import {useModel} from "@@/plugin-model/useModel";
import {getServerRoute} from "@/utils/route/serverRouteUtils";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";


export interface MenuDetailInfoFormProps {
  menuDetailInfo?: MenuDetailInfo;
  tipsShow?: boolean;
  tipsTitle?: string;
  tipsContent?: string;
  tipsType?: 'success' | 'info' | 'warning' | 'error',
  simpleMenuInfo?: SimpleMenuInfo[];
  removedMenu: (value: number | undefined) => void;
  addedMenu: () => void;
  updatedMenu: (menuInfo: MenuDetailInfo) => void;
  reloadMenu: (values: boolean) => void;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 11 },
    md: { span: 10 },
  },
};

// 获取简要菜单信息
const selfGetSimpleMenuInfo = async (): Promise<SimpleMenuInfo[]> => {
  const data: ResponseData<SimpleMenuInfo[]> = await getSimpleMenuInfo();
  if (data.code === 200 && data.data) {
    return data.data;
  }
  message.error({ content: `获取菜单信息出错:${data.message}`, key: 'MenuMangerError'});
  return [];
};

// 获取非树状的排除父类和含重定向的菜单信息
const selfGetFactAndNoRedirectMenuDetailInfo = async (): Promise<SimpleMenuInfo[]> => {
  const data: ResponseData<SimpleMenuInfo[]> = await getFactAndNoRedirectMenuDetailInfo();
  if(data.code === 200 && data.data){
    return data.data;
  }
  message.error({ content: `获取不含父类及重定向菜单信息出错:${data.message}`, key: 'MenuMangerError'});
  return [];
};

// 滚动到指定位置
const scrollToAnchor = (anchorName: string) => {
  if (anchorName) {
    let anchorElement = document.getElementById(anchorName);
    if(anchorElement) {
      anchorElement.scrollIntoView(
        {behavior: 'smooth'}
      );
    }
  }
};


const MenuDetailInfoForm: React.FC<MenuDetailInfoFormProps> = (props) => {
  const [menuDetailForm] = Form.useForm();
  const { menuDetailInfo, simpleMenuInfo, tipsShow, tipsTitle, tipsContent, tipsType, removedMenu, reloadMenu, updatedMenu, addedMenu } = props;
  const [allDisabled, setAllDisabled] = useState<boolean>(false);
  const [hasChildDisabled, setHasChildDisabled] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [tipsShowState, setTipsShowState] = useState<boolean>(tipsShow || false);
  const [tipsTitleState, setTipsTitleState] = useState<string>(tipsTitle || '无法更改');
  const [tipsContentState, setTipsContentState] = useState<any>(tipsContent || <div>此菜单为系统默认菜单，无法对其信息进行编辑或删除</div>);
  const [tipsTypeState, setTipsTypeState] = useState<'success' | 'info' | 'warning' | 'error' | undefined>(tipsType || 'error');
  const [localSimpleMenuInfo, setLocalSimpleMenuInfo] = useState<SimpleMenuInfo[] | undefined>(undefined);
  const [localNoParentMenuInfo, setLocalNoParentMenuInfo] = useState<SimpleMenuInfo[] | undefined>(undefined);
  const [parentMenuPath, setParentMenuPath] = useState<string>('/');
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [outSideLink, setOutSideLink] = useState<boolean>(false);
  const [showMenuSide, setShowMenuSide] = useState<boolean>(true);
  const [menuLayout, setMenuLayout] = useState<MenuLayOutEnum>(MenuLayOutEnum.MIX);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [iconModalVisible, setIconModalVisible] = useState<boolean>(false);
  const [iconPrefix, setIconPrefix] = useState('SmileOutlined');
  const { initialState, setInitialState } = useModel('@@initialState');
  const setMenuData = async () => {
    setInitialState({
      ...initialState,
      menuData: [],
      settings: {
        title: '重新载入...',
        menu: {
          locale: false,
          loading: true,
        },
      },
    });
    const menuData = loopMenuItem(await getServerRoute());
    setInitialState({
      ...initialState,
      menuData,
      settings: {
        title: 'XQOO Pro',
        menu: {
          locale: false,
          loading: false,
        },
      },
    });
  };

  useEffect(() => {
    setTipsShowState(tipsShow || false)
    setTipsTitleState(tipsTitle || '')
    setTipsContentState(tipsContent || undefined)
    setTipsTypeState(tipsType || undefined);
  },[tipsShow]);

  useEffect(() => {
    if(!simpleMenuInfo){
      selfGetSimpleMenuInfo().then(res => {
        setLocalSimpleMenuInfo([{key: 0,title: '顶级目录', value: 0}].concat(res));
        setBtnLoading(false);
      }).catch(e => {
        message.error('查询菜单信息出错', e)
        setLocalSimpleMenuInfo([{key: 0,title: '顶级目录', value: 0}]);
      })
    }else{
      setLocalSimpleMenuInfo([{key: 0,title: '顶级目录', value: 0}].concat(simpleMenuInfo));
    }
  }, [simpleMenuInfo]);

  useEffect(() => {
    selfGetFactAndNoRedirectMenuDetailInfo().then(res => {
      setLocalNoParentMenuInfo(res);
    }).catch(e => {
      message.error('查询菜单信息出错', e)
      setLocalNoParentMenuInfo([]);
    })
  }, [simpleMenuInfo]);

  // 表单初始化方法
  const initFormValue = (menuInfo: MenuDetailInfo | undefined): void => {
    const formObj = new FormMenuDetailInfo(menuInfo).formMenuDetailInfo();
    if(formObj?.parentPath){
      setParentMenuPath(formObj.parentPath);
    }
    setMenuLayout(formObj?.layout || MenuLayOutEnum.MIX);
    if(formObj?.outSideJump){
      setOutSideLink(true);
    }else{
      setOutSideLink(false);
    }
    menuDetailForm.resetFields();
    menuDetailForm.setFieldsValue(formObj);
    setIconPrefix(formObj?.icon || 'SmileOutlined');
    setHasChange(false);
    setTipsShowState(false);
    if(menuDetailInfo?.defaultFlag){
      setAllDisabled(true);
      setTipsShowState(true);
      setTipsTypeState('warning');
      setTipsTitleState('无法编辑');
      setTipsContentState('此项为系统默认菜单路由，无法通过正常渠道对其进行更改')
    }else{
      setAllDisabled(false);
      setTipsShowState(false);
    }
    if(menuDetailInfo?.hasChild){
      setHasChildDisabled(true);
    }else{
      setHasChildDisabled(false);
    }
  };

  useEffect(() => {
    menuDetailForm.resetFields();
    // 初始化表单数据
    initFormValue(menuDetailInfo);
  }, [menuDetailInfo]);

  // 父级菜单树变动处理
  const onMenuSelectChange = (value: any) => {
    let parentPath = '/';
    if(!value || value === 0){
      setParentMenuPath(parentPath);
    }
    loopFindMenuItem(value, localSimpleMenuInfo || []).then(obj => {
      if(obj){
        if(obj.key === 0){
          parentPath = `/`;
          setParentMenuPath(parentPath);
          menuDetailForm.setFieldsValue({ parentId: value, parentPath});
          return;
        }
        parentPath = `${obj?.path}/`;
        setParentMenuPath(parentPath);
        menuDetailForm.setFieldsValue({ parentId: value, parentPath});
      }else{
        setParentMenuPath('/');
        menuDetailForm.setFieldsValue({ parentId: value, parentPath});
      }
    }).catch(e => {
      console.error('父级菜单变动处理失败', e);
    });
  };

  // 取消外部或者重定向时改变路径头
  const cancelChangeParentPath = async (): Promise<string> => {
    const parentId = menuDetailForm.getFieldValue('parentId');
    if(!parentId || parentId === 0){
      return '/';
    }
    const obj = await loopFindMenuItem(parentId, localSimpleMenuInfo || []);
    if(obj){
      if(obj){
        if(obj.key === 0){
          return `/`;
        }
        return `${obj?.path}/`;
      }
      return '/'
    }
    return '/';
  };

  // 高亮菜单树变动处理
  const onParentKeysSelectChange = (value: any) => {
    if(value){
      menuDetailForm.setFieldsValue({parentKeys: value})
    }
  };

  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if(!menuDetailInfo){
      setHasChange(true);
      return;
    }
    if(FormValueDiffOrigin(changedValues, allValues, menuDetailInfo)){
      setHasChange(false);
    }else{
      setHasChange(true);
    }
  };

  // 表单提交
  const onFinish = (values: any) => {
    if(values.parentId === undefined){
      setTipsShowState(true);
      setTipsTypeState('error');
      setTipsTitleState('关键信息为空');
      setTipsContentState('请选择父级依赖菜单');
      return;
    }
    setTipsShowState(false);
    const submitObj: MenuDetailInfo = _assign({}, menuDetailInfo, values);
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: async () => {
        setBtnLoading(true);
        reloadMenu(true);
        await updateMenuInfo(submitObj);
      },
    });
  };

  // 表单提交失败回调
  const onFinishFailed = (errorInfo: any) => {
    setTipsShowState(true);
    setTipsTypeState('error');
    setTipsTitleState('请完善表单');
    new Promise((resolve) => {
      const msg: ReactNodeArray = [];
      errorInfo.errorFields.forEach((item: { name: any[]; errors: any[]; })=> {
        msg.push(<div>{item.errors.join(',')}<br /></div>);
      })
      resolve(msg);
    }).then(res => {
      setTipsContentState(<div>表单校验有误：{res}</div>);
    }).catch(e => {
      console.warn('表单校验不通过', e)
      setTipsContentState(`表单校验有误：校验不通过无法提交`);
    })
    console.warn('Failed Submit Form:', errorInfo);
  };

  // 提交数据到服务器
  const updateMenuInfo = async (value: MenuDetailInfo): Promise<void> => {
    const res = await updateMenuDataToServer(value);
    if(res.code === 200){
      setBtnLoading(false);
      setMenuData().then(() => {
        if(!value.id){
          addedMenu();
        }else{
          updatedMenu(value);
          scrollToAnchor('tipsTop');
        }
      });
    }else{
      setBtnLoading(false);
      reloadMenu(false);
      setTipsShowState(true);
      setTipsTitleState('发生错误');
      setTipsTitleState(res.message || '更新菜单发生错误，请重试');
      setTipsTypeState('error');
      scrollToAnchor('tipsTop');
    }
  };

  // 删除菜单
  const confirmRemoveMenu = () => {
    if(!menuDetailInfo?.id){
      message.error('丢失当前菜单id，删除失败，请刷新重试');
      return;
    }
    setBtnLoading(true);
    reloadMenu(true);
    removeMenuDetailInfo(menuDetailInfo?.id).then(res => {
      setBtnLoading(false);
      if(res.code !== 200){
        reloadMenu(false);
        setTipsShowState(true);
        setTipsTitleState('发生错误');
        setTipsTitleState(res.message || '删除菜单发生错误，请重试');
        setTipsTypeState('error');
        scrollToAnchor('tipsTop');
      }else{
        setMenuData().then(() => {
          removedMenu(menuDetailInfo?.id);
        });

      }
    }).catch(e => {
      setBtnLoading(false);
      reloadMenu(false);
      setTipsShowState(true);
      setTipsTitleState('发生错误');
      setTipsTitleState('删除菜单发生错误，请重试');
      setTipsTypeState('error');
      scrollToAnchor('tipsTop');
      console.error('remove menu error!', e)
    });
  };

  // 菜单名字关联变动
  const menuChineseNameChange = ({ target: { value } }: any) => {
    menuDetailForm.setFieldsValue({ name: value });
  };


  // 外部链接路径选择
  const outLinkSelected = (
    <Select disabled={allDisabled} defaultValue={menuDetailForm.getFieldValue('parentPath')} onChange={(value) => {
      setTimeout(() => {
        menuDetailForm.setFieldsValue({parentPath: value});

      }, 10);
    }}>
      <Select.Option value="http://">http://</Select.Option>
      <Select.Option value="https://">https://</Select.Option>
    </Select>
  );


  // 菜单参数render
  const menuProperties = () => {
    const eleArr = [];
    if(!outSideLink){
      eleArr.push(
        <Row key={99}>
          <Col md={12} xs={24}>
            <Divider orientation="left" plain>
              左侧菜单相关
            </Divider>
          </Col>
        </Row>
      );
      eleArr.push(
        <Form.Item
          key={1}
          label="渲染左侧菜单"
          name="menuRender"
          valuePropName="checked"
          tooltip={<Tooltip title=''>
            默认为开启，如果关闭，则跳转到指定路由时不显示左侧菜单<br/>
            关闭此项将导致布局方式、固定菜单、显示菜单头，菜单主题等均不可用
          </Tooltip>}
        >
          <Switch disabled={allDisabled || hasChildDisabled} checkedChildren="开启" unCheckedChildren="关闭" onChange={ (checked: boolean) => {
            setShowMenuSide(checked)
          }} />
        </Form.Item>
      );
      if(showMenuSide){
        eleArr.push(
          <Row key={2}>
            <Col  md={12} xs={24}>
              <Alert
                message="菜单关闭时以下参数不可配置"
                showIcon
                type="info"
                closable
                closeText="我知道了"
              />
            </Col>
          </Row>
        );
        eleArr.push(
          <div key={3} style={{height: '20px'}}/>
        );
        eleArr.push(
          <Form.Item
            key={4}
            label="布局方式"
            name="layout"
            tooltip={<Tooltip title=''>
              此项决定打开菜单页面之后整体布局展示，分为side-常规布局，top-顶端菜单布局，mix-混合布局<br/>
              如果次菜单为父级菜单，则更换布局之后则此菜单子级菜单默认全部集成该菜单的布局，子级菜单也可单独定义<br/>
              左侧-布局下，菜单头渲染无效，header头主题无效<br/>
              顶端-布局下，菜单在头部，所有相关header属性无效<br/>
              混合-布局下，全部菜单和页头属性生效
            </Tooltip>}
            rules={[
              { required: true }
            ]}
          >
            <Select style={{ width: '40%'}} disabled={allDisabled || hasChildDisabled} onChange={(value: MenuLayOutEnum) => {
              setMenuLayout(value);
            }}>
              <Select.Option value={MenuLayOutEnum.MIX}>混合</Select.Option>
              <Select.Option value={MenuLayOutEnum.TOP}>顶端</Select.Option>
              <Select.Option value={MenuLayOutEnum.SIDE}>左侧</Select.Option>
            </Select>
          </Form.Item>
        );
        eleArr.push(
          <Form.Item
            key={5}
            label="菜单主题"
            name="navTheme"
            tooltip={<Tooltip title=''>
              默认为【亮色】主题，目前仅有【暗色】【亮色】可选<br/>
            </Tooltip>}
            rules={[
              { required: true }
            ]}
          >
            <Select style={{ width: '40%'}} disabled={allDisabled || hasChildDisabled}>
              <Select.Option value={MenuHeaderTheme.LIGHT}>亮色</Select.Option>
              <Select.Option value={MenuHeaderTheme.DARK}>暗色</Select.Option>
            </Select>
          </Form.Item>
        );
        if(menuLayout !== MenuLayOutEnum.MIX){
          eleArr.push(
            <Form.Item
              key={6}
              label="菜单头渲染"
              name="menuHeaderRender"
              valuePropName="checked"
              tooltip={<Tooltip title=''>
                默认为开启，如果关闭，将不显示菜单上方的logo以及title文字<br/>
                此项属性在布局为【混合】时无效
              </Tooltip>}
            >
              <Switch disabled={allDisabled || hasChildDisabled} checkedChildren="开启" unCheckedChildren="关闭"/>
            </Form.Item>
          );
        }
        if(menuLayout !== MenuLayOutEnum.TOP){
          eleArr.push(
            <Form.Item
              key={7}
              label="固定菜单栏"
              name="fixSiderbar"
              valuePropName="checked"
              tooltip={<Tooltip title=''>
                默认为开启，如果关闭，菜单将不再滚动页面时固定<br/>
                此项属性在布局为【顶端】时无效
              </Tooltip>}
            >
              <Switch disabled={allDisabled || hasChildDisabled} checkedChildren="开启" unCheckedChildren="关闭"/>
            </Form.Item>
          );
        }
      }
    }
    return eleArr;
  };

  // 页头参数render
  const headerProperties = () => {
    const eleArr = [];
    if(!outSideLink){
      eleArr.push(
        <Row key={11}>
          <Col md={12} xs={24}>
            <Divider orientation="left" plain key={1}>
              页头相关
            </Divider>
          </Col>
        </Row>
      );
      eleArr.push(
        <Form.Item
          key={12}
          label="渲染页头"
          name="headerRender"
          valuePropName="checked"
          tooltip={<Tooltip title=''>
            默认为开启，如果关闭，则不显上方页头，此项当菜单布局为【顶部】时不可用<br/>
            关闭此项将导致固定页头，页头主题等均不可用
          </Tooltip>}
        >
          <Switch disabled={allDisabled || hasChildDisabled} checkedChildren="开启" unCheckedChildren="关闭" onChange={ (checked: boolean) => {
            setShowHeader(checked)
          }} />
        </Form.Item>
      );
      if(showHeader){
        eleArr.push(
          <Row key={13}>
            <Col  md={12} xs={24}>
              <Alert
                message="页头关闭时以下参数不可配置"
                showIcon
                type="info"
                closable
                closeText="我知道了"
              />
            </Col>
          </Row>
        );
        eleArr.push(
          <Form.Item
            key={14}
            label="固定页头"
            name="fixedHeader"
            valuePropName="checked"
            tooltip={<Tooltip title=''>
              默认为开启，关闭后滚动时页头不在固定于顶部<br />
              此项配置目前测试来看刷新或重新登录时会被defaultSetting全局设定覆盖，变更意义不大<br />
              刚修改时调用initState.menuData有效，仅作为一个可选项配置
            </Tooltip>}
            rules={[
              { required: true }
            ]}
          >
            <Switch disabled={allDisabled  || hasChildDisabled} checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
        );
      }
      if(menuLayout === MenuLayOutEnum.MIX){
        eleArr.push(
          <Form.Item
            key={15}
            label="页头主题"
            name="headerTheme"
            tooltip={<Tooltip title=''>
              默认为【暗色】主题，目前仅有【暗色】【亮色】可选,仅在【混合】布局时有效<br/>
            </Tooltip>}
            rules={[
              { required: true }
            ]}
          >
            <Select style={{ width: '40%'}} disabled={allDisabled  || hasChildDisabled}>
              <Select.Option value={MenuHeaderTheme.LIGHT}>亮色</Select.Option>
              <Select.Option value={MenuHeaderTheme.DARK}>暗色</Select.Option>
            </Select>
          </Form.Item>
        );
      }
    }
    return eleArr;
  };

  // 页脚参数渲染
  const footerProperties = () => {
    const eleArr = [];
    if(!outSideLink) {
      eleArr.push(
        <Row key={21}>
          <Col md={12} xs={24}>
            <Divider orientation="left" plain key={1}>
              页脚相关
            </Divider>
          </Col>
        </Row>
      );
      eleArr.push(
        <Form.Item
          key={22}
          label="渲染页脚"
          name="footerRender"
          valuePropName="checked"
          tooltip={<Tooltip title=''>
            默认为开启，如果关闭，则不显最下方页脚，此项配置作用不明显，可忽视<br/>
          </Tooltip>}
        >
          <Switch disabled={allDisabled || hasChildDisabled} checkedChildren="开启" unCheckedChildren="关闭"/>
        </Form.Item>
      );
    }
    return eleArr;
  };

  // 其他参数渲染
  const otherProperties = () => {
    const eleArr = [];
    if(!outSideLink) {
      eleArr.push(<Row key={31}>
        <Col md={12} xs={24}>
          <Divider orientation="left" plain key={1}>
            其他参数
          </Divider>
        </Col>
      </Row>);
      eleArr.push(
        <Form.Item
          key={32}
          label="高亮父菜单"
          name="parentKeys"
          tooltip={<Tooltip title=''>选取后当跳转到此路径时，即时页面不显示也可以高亮指定的菜单，可以多选，在path格式符合标准时此项意义不大</Tooltip>}
        >
          <NoParentMenuSelect
            menuInfoArr={localNoParentMenuInfo}
            initValue={menuDetailInfo?.parentKeys}
            disabledForm={allDisabled || hasChildDisabled}
            widthStr='40%'
            model='multiple'
            loading={!localNoParentMenuInfo}
            singleSearch
            onChange={onParentKeysSelectChange}
          />
        </Form.Item>
      );
    }
    return eleArr;
  };

  return (
    <Space key='menuDetail' direction="vertical" style={{width: '100%'}}>
      <a href="#" id="tipsTop" />
        {
          tipsShowState ? <Alert
            key='tipsShow'
            message={tipsTitleState}
            description={tipsContentState}
            type={tipsTypeState}
            showIcon
            closable
            closeText="我知道了"
          /> : null
        }
      <div  style={{ minHeight: '500px'}}>
        {
          hasChange ? <Button
            type="link"
            icon={<RollbackOutlined />}
            onClick={() => {
               initFormValue(menuDetailInfo);
            }}
          >
            还原更改
          </Button> : null
        }

        <Form
          {...formItemLayout}
          key="menuDetailForm"
          form={menuDetailForm}
          name="menuDetailForm"
          scrollToFirstError
          initialValues={{}}
          validateMessages={ValidateMessages}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <Form.Item
            label="父级菜单"
            name="parentId"
            tooltip={<Tooltip title=''>请选择一个父类菜单</Tooltip>}
            rules={[{ required: true }]}
          >
            <ParentMenuSelectTree
              menuInfoArr={localSimpleMenuInfo}
              disabledForm={allDisabled || hasChildDisabled}
              initValue={menuDetailInfo ? menuDetailInfo.parentId : 0}
              nowValue={menuDetailForm.getFieldValue('parentId')}
              canCheckable={false}
              loading={!localSimpleMenuInfo}
              onChange={onMenuSelectChange}
            />
          </Form.Item>

          <Form.Item
            hidden
            label="target"
            name="target"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="是否外部连接"
            name="outSideJump"
            valuePropName="checked"
            tooltip={<Tooltip title=''>若为外部连接，多余的属性将不可配置</Tooltip>}
          >
            <Switch disabled={allDisabled || hasChildDisabled} checkedChildren="外部" unCheckedChildren="内部" onChange={(checked: boolean) => {
              setOutSideLink(checked);
              if(checked) {
                menuDetailForm.setFieldsValue({parentPath: 'http://', target: '_blank'});
              }else{
                cancelChangeParentPath().then(parentPath => {
                  setParentMenuPath(parentPath);
                  setTimeout(() => {
                    menuDetailForm.setFieldsValue({parentPath, target: null});
                  }, 10);
                });
              }
            }} />
          </Form.Item>

          <Form.Item
            hidden
            label="父辈路径值"
            name="parentPath"
            rules={[{ required: true }]}
          >
            <Input disabled={allDisabled} />
          </Form.Item>

          <Form.Item
            label="路径值"
            name="path"
            tooltip={<Tooltip title=''>请填写此路经的path值，不能包含/ # 等特殊符号</Tooltip>}
            rules={[
              { required: true },
              { max: 128 },
              { validator:  (rule, val, callback) => {
                  const pattern = outSideLink
                    ? new RegExp("[#]")
                    : new RegExp("[`#/]");
                  if (pattern.test(val)){
                    callback('[路径值]不可输入特殊字符');
                  }else {
                    callback();
                  }
                  callback();
                },
              }
            ]}
          >
            {
              outSideLink ?
                <Input disabled={allDisabled || hasChildDisabled} style={{ width: '80%' }} addonBefore={outLinkSelected} />
                :
                <Input disabled={allDisabled || hasChildDisabled} style={{ width: '50%' }} addonBefore={parentMenuPath} />
            }

          </Form.Item>
          <Form.Item
            label="排序"
            name="sortNo"
            tooltip={<Tooltip title=''>
              排序的顺序，正序，相同级别相同顺序按照新增是时间正序排序
            </Tooltip>}
            rules={[
              { required: true },
              { type: 'number', min: 0, max: 99999 }
            ]}
          >
            <InputNumber disabled={allDisabled} style={{ width: '20%' }} max={99999} min={1} precision={0} />
          </Form.Item>

          <Form.Item
            label='图标'
            tooltip={<Tooltip title=''>
              当前版本限制，仅一级菜单的图标可以展示，其余层级的图标选中后依然无法在菜单栏上正确输出
            </Tooltip>}
          >
            <Row>
              <Col md={7} xs={24}>
                <Form.Item
                  name="icon"
                >
                  <Input readOnly prefix={CustomIconMap[iconPrefix]} />
                </Form.Item>
              </Col>
              <Col md={6} xs={24}>
                <Button disabled={allDisabled} type='link' onClick={
                  () => {setIconModalVisible(true)}
                }>点击选择图标</Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label="是否隐藏"
            name="hideInMenu"
            valuePropName="checked"
            tooltip={<Tooltip title=''>如果关闭显示，则在菜单中不可见其选项，但是可以直接输入路径跳转，如果有子路径，则会隐藏所有子级</Tooltip>}
          >
            <Switch disabled={allDisabled} checkedChildren="隐藏" unCheckedChildren="显示"/>
          </Form.Item>

          <Form.Item
            label="菜单展示中文名"
            name="chineseName"
            tooltip={<Tooltip title=''>
              请填菜单值的名称，不能包含~@#\[\]/? 等特殊符号
            </Tooltip>}
            rules={[
              { required: true },
              { max: 64 },
              { validator:  (rule, val, callback) => {
                  const pattern = new RegExp("[~@#\\[\\]/?]");
                  if (pattern.test(val)){
                    callback(`[菜单展示中文名]不可输入特殊字符[~@#\\[\\]/?]`);
                  }else {
                    callback();
                  }
                  callback();
                },
              }
            ]}
          >
            <Input disabled={allDisabled} style={{ width: '60%' }} onChange={menuChineseNameChange} />
          </Form.Item>

          <Form.Item
            label="菜单名称"
            name="name"
            tooltip={<Tooltip title=''>
              此项为空时默认跟随chineseName变动，如有特殊需要（例如：国际化代码）则单独输入，不能夹杂乱码，最长不超过64个字符
            </Tooltip>}
            rules={[
              { required: true },
              { max: 64 },
              { validator:  (rule, val, callback) => {
                  const pattern = new RegExp("[~@#\\[\\]/?]");
                  if (pattern.test(val)){
                    callback('[菜单名称]不可输入特殊字符[~@#\\[\\]/?]');
                  }else {
                    callback();
                  }
                  callback();
                },
              }
            ]}
          >
            <Input disabled={allDisabled} style={{ width: '60%' }} />
          </Form.Item>
          {
            !outSideLink ?
              <Form.Item
                label="依赖组件路径"
                name="component"
                required={!menuDetailInfo?.hasChild}
                tooltip={<Tooltip title=''>
                  此项输入前端实际文件路径，相对路径，不可填入特殊字符，区分大小写，路径错误将导致菜单404，有子菜单的情况下此项可不填
                </Tooltip>}
                rules={[
                  { required: !menuDetailInfo?.hasChild},
                  { max: 64 },
                  { validator:  (rule, val, callback) => {
                      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>《》?！￥…（）—【】‘；：”“。，、？]");
                      if (pattern.test(val)){
                        callback('[依赖组件路径]不可输入特殊字符[~@#\\[\\]/?]');
                      }else {
                        callback();
                      }
                      callback();
                    },
                  }
                ]}
              >
                <Input disabled={allDisabled} style={{ width: '60%' }} />
              </Form.Item>
              : null
          }
          {
            menuProperties()
          }
          {
            headerProperties()
          }
          {
            footerProperties()
          }
          {
            otherProperties()
          }
          <Row>
            <Col md={3} xs={8} style={{textAlign: 'right'}}>
              <Button shape="round" icon={<SaveOutlined />} type="primary" htmlType="submit" disabled={!hasChange || allDisabled} loading={btnLoading}>
                {
                  menuDetailInfo ? '保存' : '新增'
                }
              </Button>
            </Col>
            <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
              {
                menuDetailInfo ?
                  <Popconfirm
                    title="确定删除当前记录？"
                    onConfirm={confirmRemoveMenu}
                    onCancel={() => {return false;}}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button shape="round" icon={<DeleteOutlined />} type="primary" danger disabled={allDisabled} loading={btnLoading}>删除</Button>
                  </Popconfirm>
                  :
                  <Button shape="round" icon={<RedoOutlined />} type="default" onClick={() => {
                    if(hasChange){

                    }
                    initFormValue(undefined)
                  }} loading={btnLoading}>
                    重置
                  </Button>
              }
            </Col>
          </Row>
        </Form>
      </div>
      <IconModal
        key='iconModal'
        showModal={iconModalVisible}
        modalWidth="50%"
        maskClosable={false}
        onCloseModal={() => {
          setIconModalVisible(false);
        }}
        onOkModal={() => {
          setIconModalVisible(false);
        }}
        onClickIcon={(iconObj) => {
          setIconModalVisible(false);
          setIconPrefix(iconObj);
          menuDetailForm.setFieldsValue({ icon: iconObj});
        }}
      />
    </Space>
  );
}
export default MenuDetailInfoForm;
