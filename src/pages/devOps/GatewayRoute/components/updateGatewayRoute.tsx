import React, {ReactNodeArray, useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {history} from "umi";
import {useModel} from "@@/plugin-model/useModel";
import {assign as _assign, find as _find, forIn as _forIn, remove as _remove, concat as _concat} from "lodash";
import {GatewayRouteEntity} from "@/pages/devOps/GatewayRoute/data";
import GatewayRouteClass from "@/pages/devOps/GatewayRoute/GatewayRouteClass";
import ProSkeleton from '@ant-design/pro-skeleton';
import {
  Alert,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message, Modal,
  Result,
  Row,
  Select,
  Space,
  Tooltip,
} from "antd";
import {RollbackOutlined, ReloadOutlined, SaveOutlined, PlusOutlined, QuestionCircleOutlined, DeleteOutlined, EditOutlined, MinusOutlined} from "@ant-design/icons";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import QueueAnim from "rc-queue-anim";
import PropertiesDetailModal from "@/pages/devOps/GatewayRoute/components/PropertiesDetailModal";
import styles from '@/pages/devOps/GatewayRoute/index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 10 },
    sm: { span: 10 },
    md: { span: 13 },
  },
};

const UpdateGatewayRoute: React.FC<{}> = () => {
  const { gatewayRouteInfo, gatewayPredicatesList,
    gatewayFiltersList, loading, queryLoading, hasError, errorMessage,
    alertTipsShow, alertTipsMessage, alertTipsType,
    alertTipsHandle, clearInfo, getRouteSingleFromServer,getPredicateConfigFromServer,
    getFilterConfigFromServer, putRouteInfoToServer} = useModel('devOps.GatewayRoute.GatewayRouteUpdateModel');
  const [routeInfoForm] = Form.useForm();
  const [localFormInfo, setLocalFormInfo] = useState<GatewayRouteEntity|undefined>();
  const [localPredicateConfig, setLocalPredicateConfig] = useState<any[]>([]);
  const [localFilterConfig, setLocalFilterConfig] = useState<any[]>([]);
  const [predicateNodeArr, setPredicateNodeArr] = useState<ReactNodeArray>([]);
  const [filterNodeArr, setFilterNodeArr] = useState<ReactNodeArray>([]);
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [predicateTipsMap, setPredicateTipsMap] = useState<object>({});
  const [filterTipsMap, setFilterTipsMap] = useState<object>({});
  const [propertiesMap, setPropertiesMap] = useState<{ keyValue: string, value: string, type: string; parentIndex: any, handleType: 'predicate'|'filter'}>();
  const [showProperties, setShowProperties] = useState<boolean>(false);

  const pathHash = history.location;
  // 初始化地址栏参数查询
  const initQuery = () => {
    const { query } = pathHash
    const routeId: any = query?.routeId;
    if(routeId){
      getRouteSingleFromServer(routeId);
    }else{
      clearInfo();
    }
  };

  const initFormInfo = (info: GatewayRouteEntity|undefined) => {
    if(!info){
      info = new GatewayRouteClass(undefined).initRouteInfo();
    }
    if(info){
      try{
        setLocalPredicateConfig(JSON.parse(info?.predicates as string));
        setLocalFilterConfig(JSON.parse(info?.filters as string));
      }catch (e) {
        console.error('init LocalConfig Error !', e);
      }
      routeInfoForm.setFieldsValue(info);
      setHasChange(false);
    }
  };

  useEffect(() => {
    initQuery();
    getPredicateConfigFromServer();
    getFilterConfigFromServer();
  },[]);

  useEffect(() => {
    if(gatewayRouteInfo){
      setLocalFormInfo(new GatewayRouteClass(gatewayRouteInfo).initRouteInfo());
    }else{
      setLocalFormInfo(new GatewayRouteClass(undefined).initRouteInfo());
    }
  }, [gatewayRouteInfo]);

  useEffect(() => {
    initFormInfo(localFormInfo);
  }, [localFormInfo]);

  useEffect(() => {
    if(gatewayPredicatesList.length > 0){
      const tmpObj = {};
      gatewayPredicatesList.forEach(item => {
        tmpObj[item.predicatesName] = item.predicatesTips;
      });
      setPredicateTipsMap(tmpObj);
    }
  }, [gatewayPredicatesList]);

  useEffect(() => {
    if(gatewayFiltersList.length > 0){
      const tmpObj = {};
      gatewayFiltersList.forEach(item => {
        tmpObj[item.filtersName] = item.filtersTips;
      });
      setFilterTipsMap(tmpObj);
    }
  }, [gatewayFiltersList]);

  useEffect(() => {
    if(localPredicateConfig.length > 0){
      generatorPredicateConfigItem();
      const jsonStr = JSON.stringify(localPredicateConfig);
      if(jsonStr !== gatewayRouteInfo?.predicates && !hasChange){
        setHasChange(true);
      }
      if(jsonStr === gatewayRouteInfo?.predicates && FormValueDiffOrigin([], routeInfoForm.getFieldsValue(), localFormInfo)){
        setHasChange(false);
      }
    }
  }, [localPredicateConfig]);

  useEffect(() => {
    if(localFilterConfig.length > 0){
      generatorFilterConfigItem();
      const jsonStr = JSON.stringify(localFilterConfig);
      if(jsonStr !== gatewayRouteInfo?.filters && !hasChange){
        setHasChange(true);
      }
      if(jsonStr === gatewayRouteInfo?.filters && FormValueDiffOrigin([], routeInfoForm.getFieldsValue(), localFormInfo)){
        setHasChange(false);
      }
    }
  }, [localFilterConfig]);

  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if(!localFormInfo){
      setHasChange(true);
      return;
    }
    if(FormValueDiffOrigin(changedValues, allValues, localFormInfo)){
      setHasChange(false);
    }else{
      setHasChange(true);
    }
  };

  // 查询表单提交
  const onFinish = (values: any) => {
    if(!localPredicateConfig || localPredicateConfig.length < 1){
      message.warning('断言配置至少一条！');
      return;
    }
    if(!localFilterConfig || localFilterConfig.length < 1){
      message.warning('过滤器配置至少一条！');
      return;
    }
    if(!judgeSubmitValue(localPredicateConfig)){
      message.warning('每个断言器参数不能为null！');
      return;
    }
    if(!judgeSubmitValue(localFilterConfig)){
      message.warning('过滤器参数不能为null！');
      return;
    }
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '确定提交信息？',
      onOk: async () => {
        const tmpObj = {
          predicates: JSON.stringify(localPredicateConfig),
          filters: JSON.stringify(localFilterConfig)
        };
        console.log(_assign({}, gatewayRouteInfo, values, tmpObj));
        const success = await putRouteInfoToServer(_assign({}, gatewayRouteInfo, values, tmpObj));
        if(success){
          setHasChange(false);
          setTimeout(() => {
            history.push('/devOps/gatewayRoute');
          }, 3000);
        }
      },
    });
  };

  const judgeSubmitValue = (arr: any[]): boolean => {
    for(const item of arr){
      if(!item.args){
        return false;
      }
    }
    return true;
  };

  // 生成断言配置选项
  const generatorPredicateOption = (): ReactNodeArray => {
    const arr: ReactNodeArray = [];
    gatewayPredicatesList.forEach((item, index) => {
      arr.push(
        <Select.Option key={index} value={item.predicatesName}>{item.predicatesName}</Select.Option>
      );
    });
    return arr;
  };

  // 新增断言器配置
  const addPredicate = () => {
    const arr = _concat(localPredicateConfig, [{name: 'Path', args: { "_genkey_0": "/example/**"}}]);
    setLocalPredicateConfig(arr);
  };

  // 移除断言配置
  const removePredicate = (index: number) => {
    const tmpArr = _remove(localPredicateConfig, (item, no) => {return index !== no });
    setLocalPredicateConfig(tmpArr);
  };

  // 改变断言器
  const changePredicate = (checkIndex: number, value: any) => {
    const arr: any[] = [];
    localPredicateConfig.forEach((item, index) => {
      if(index === checkIndex){
        item.name = value;
        item.args = {};
      }
      arr.push(item);
    });
    setLocalPredicateConfig(arr);
  };

  // 增加断言器参数
  const addPredicateProperties = (predicateIndex: number, predicateProperties: any): void => {
    const obj = _find(gatewayPredicatesList, (item) => {return item.predicatesName === predicateProperties.name});
    if(!obj){
      message.warning('未找到相应参数配置，请刷新重试');
      return;
    }
    let keyValue = '';
    if(obj.predicatesType === 'args'){
      let i = 0;
      _forIn(predicateProperties.args, (value, key) => {
        i ++;
      });
      keyValue = '_genkey_' + i;
    }
    setPropertiesMap({
      keyValue,
      value: '',
      type: obj.predicatesType,
      parentIndex: predicateIndex,
      handleType: 'predicate'
    });
    setShowProperties(true);
  };

  // 修改断言器参数
  const updatePredicateProperties = (predicateIndex: number, propertiesObj: any, parentName: string): void => {
    const obj = _find(gatewayPredicatesList, (item) => { return item.predicatesName === parentName});
    if(!obj){
      message.warning('未找到相应参数配置，请刷新重试');
      return;
    }
    setPropertiesMap({
      keyValue: propertiesObj.key,
      value: propertiesObj.value,
      type: obj.predicatesType,
      parentIndex: predicateIndex,
      handleType: 'predicate'
    });
    setShowProperties(true);
  };

  // 移除断言器参数
  const removePredicateProperties = (delKey: string, parentIndex: any) => {
    const arr: any[] = [];
    localPredicateConfig.forEach((item, index) => {
      if(index === parentIndex){
        const tmpObj = {};
        _forIn(item.args, (value, key) => {
          if(key !== delKey){
            tmpObj[key] = value;
          }
        });
        item.args = tmpObj;
      }
      arr.push(item);
    });
    setLocalPredicateConfig(arr);
  };

  // 构造断言器参数列表
  const generatorPredicateProperties = (parentIndex: number, obj: object, parentName: string): ReactNodeArray => {
    const arr: ReactNodeArray = [];
    let i = 0;
    _forIn(obj, (value, key) => {
      arr.push(
        <li key={parentIndex + '_' + i} className={styles.propertiesLi}>
          <Space>
            <span>参数key:&nbsp;&nbsp;{key}</span>
            <span>参数值:&nbsp;&nbsp;{value}</span>
            <Button type="primary" shape="circle" icon={<EditOutlined />} size='small' onClick={() => {updatePredicateProperties(parentIndex, {key, value}, parentName)}} />
            <Button type="primary" danger shape="circle" icon={<MinusOutlined />} size='small' onClick={() => {removePredicateProperties(key, parentIndex)}} />
          </Space>
        </li>
      );
      i ++;
    });
    return arr;
  };

  // 构造断言配置dom
  const generatorPredicateConfigItem = () => {
    const arr: ReactNodeArray = [];
    localPredicateConfig.forEach((item, index) => {
      arr.push(
        <li className={styles.mainLi} key={index}>
          <Row>
            <Col span={10}>
              <Space>
                {
                  localPredicateConfig.length > 1 ?
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} size='small' onClick={() => {removePredicate(index)}} />
                    :
                    null
                }
                <span>断言配置:</span>
                <Tooltip title={predicateTipsMap[item.name]}>
                  <QuestionCircleOutlined />
                </Tooltip>
                <Select showSearch value={item.name} placeholder="请选择断言配置" style={{width: 130}} onChange={(value) => {changePredicate(index, value)}}>
                  {
                    generatorPredicateOption()
                  }
                </Select>
              </Space>
            </Col>
            <Col span={14}>
              <Space>
                <Button type="default" shape="circle" title="增加参数" icon={<PlusOutlined />} size='small' onClick={() => {addPredicateProperties(index, item)}} />
                <ul className={styles.propertiesUl}>
                  {
                    generatorPredicateProperties(index, item.args, item.name)
                  }
                </ul>
              </Space>
            </Col>
          </Row>
        </li>
      );
    });
    setPredicateNodeArr(arr);
  };

  // 生成过滤器配置选项
  const generatorFiltersOption = (): ReactNodeArray => {
    const arr: ReactNodeArray = [];
    gatewayFiltersList.forEach((item, index) => {
      arr.push(
        <Select.Option key={index} value={item.filtersName}>{item.filtersName}</Select.Option>
      );
    });
    return arr;
  };

  // 新增过滤器配置
  const addFilter = () => {
    const arr = _concat(localFilterConfig, [{name: 'StripPrefix', args: { "_genkey_0": "1"}}]);
    setLocalFilterConfig(arr);
  };

  // 移除过滤器配置
  const removeFilter = (index: number) => {
    const tmpArr = _remove(localFilterConfig, (item, no) => {return index !== no });
    setLocalFilterConfig(tmpArr);
  };

  // 改变过滤器
  const changeFilter = (checkIndex: number, value: any) => {
    const arr: any[] = [];
    localFilterConfig.forEach((item, index) => {
      if(index === checkIndex){
        item.name = value;
        item.args = {};
      }
      arr.push(item);
    });
    setLocalFilterConfig(arr);
  };

  // 增加过滤器参数
  const addFilterProperties = (filterIndex: number, filterProperties: any): void => {
    const obj = _find(gatewayFiltersList, (item) => {return item.filtersName === filterProperties.name});
    if(!obj){
      message.warning('未找到相应参数配置，请刷新重试');
      return;
    }
    let keyValue = '';
    if(obj.filtersType === 'args'){
      let i = 0;
      _forIn(filterProperties.args, (value, key) => {
        i ++;
      });
      keyValue = '_genkey_' + i;
    }
    setPropertiesMap({
      keyValue,
      value: '',
      type: obj.filtersType,
      parentIndex: filterIndex,
      handleType: 'filter'
    });
    setShowProperties(true);
  };

  // 修改过滤器参数
  const updateFilterProperties = (filterIndex: number, propertiesObj: any, parentName: string): void => {
    const obj = _find(gatewayFiltersList, (item) => { return item.filtersName === parentName});
    if(!obj){
      message.warning('未找到相应参数配置，请刷新重试');
      return;
    }
    setPropertiesMap({
      keyValue: propertiesObj.key,
      value: propertiesObj.value,
      type: obj.filtersType,
      parentIndex: filterIndex,
      handleType: 'filter'
    });
    setShowProperties(true);
  };

  // 移除过滤器参数
  const removeFilterProperties = (delKey: string, parentIndex: any) => {
    const arr: any[] = [];
    localFilterConfig.forEach((item, index) => {
      if(index === parentIndex){
        const tmpObj = {};
        _forIn(item.args, (value, key) => {
          if(key !== delKey){
            tmpObj[key] = value;
          }
        });
        item.args = tmpObj;
      }
      arr.push(item);
    });
    setLocalFilterConfig(arr);
  };

  // 构造过滤器参数列表
  const generatorFilterProperties = (parentIndex: number, obj: object, parentName: string): ReactNodeArray => {
    const arr: ReactNodeArray = [];
    let i = 0;
    _forIn(obj, (value, key) => {
      arr.push(
        <li key={parentIndex + '_' + i} className={styles.propertiesLi}>
          <Space>
            <span>参数key:&nbsp;&nbsp;{key}</span>
            <span>参数值:&nbsp;&nbsp;{value}</span>
            <Button type="primary" shape="circle" icon={<EditOutlined />} size='small' onClick={() => {updateFilterProperties(parentIndex, {key, value}, parentName)}} />
            <Button type="primary" danger shape="circle" icon={<MinusOutlined />} size='small' onClick={() => {removeFilterProperties(key, parentIndex)}} />
          </Space>
        </li>
      );
      i ++;
    });
    return arr;
  };

  // 构造过滤器配置dom
  const generatorFilterConfigItem = () => {
    const arr: ReactNodeArray = [];
    localFilterConfig.forEach((item, index) => {
      arr.push(
        <li className={styles.mainLi} key={index}>
          <Row>
            <Col span={10}>
              <Space>
                {
                  localFilterConfig.length > 1 ?
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} size='small' onClick={() => {removeFilter(index)}} />
                    :
                    null
                }
                <span>过滤配置:</span>
                <Tooltip title={filterTipsMap[item.name]}>
                  <QuestionCircleOutlined />
                </Tooltip>
                <Select showSearch value={item.name} placeholder="请选择过滤配置" style={{width: 130}} onChange={(value) => {changeFilter(index, value)}}>
                  {
                    generatorFiltersOption()
                  }
                </Select>
              </Space>
            </Col>
            <Col span={14}>
              <Space>
                <Button type="default" shape="circle" title="增加参数" icon={<PlusOutlined />} size='small' onClick={() => {addFilterProperties(index, item)}} />
                <ul className={styles.propertiesUl}>
                  {
                    generatorFilterProperties(index, item.args, item.name)
                  }
                </ul>
              </Space>
            </Col>
          </Row>
        </li>
      );
    });
    setFilterNodeArr(arr);
  };

  const closePropertiesModal = (success: boolean)=> {
    setShowProperties(false);
  };

  const submitPropertiesModal = (result: { keyValue: string, value: string, parentIndex: any, handleType: 'predicate'|'filter'}) => {
    if(result.handleType === 'predicate'){
      const arr: any[] = [];
      localPredicateConfig.forEach((item, index) => {
        if(index === result.parentIndex){
          let tmpObj = {};
          tmpObj[result.keyValue] = result.value;
          item.args = _assign({}, item.args, tmpObj);
        }
        arr.push(item);
      });
      setLocalPredicateConfig(arr);
    }
    setShowProperties(false);
  };

  return (
    <PageContainer fixedHeader>
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
      {
        hasError ?
          <div className={styles.operationDiv} style={{minHeight: '350px'}}>
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
              extra={
                <Space size='large'>
                  <Button type="default" icon={<RollbackOutlined />} loading={loading} onClick={() => { history.push("/devOps/gatewayRoute")}}>返回</Button>
                  <Button type="primary" icon={<ReloadOutlined />} danger loading={loading} onClick={initQuery}>重试</Button>
                </Space>
              }
            />
          </div>
          :
          <>
            {
              queryLoading ?
                <div className={styles.operationDiv} style={{minHeight: '500px'}}>
                  <ProSkeleton type="descriptions" />
                </div>
                :
                <div className={styles.operationDiv}>
                  <Divider orientation="left">
                    {
                      localFormInfo?.id ? '编辑路由信息' : '新增路由信息'
                    }
                  </Divider>
                  <Form
                    {...formItemLayout}
                    form={routeInfoForm}
                    name="routeInfoDetailForm"
                    validateMessages={ValidateMessages}
                    onFinish={onFinish}
                    onValuesChange={onValuesChange}
                  >
                    <Row gutter={[16, 16]}>
                      <Col md={5} xs={24}>
                        <Form.Item
                          name="serviceId"
                          label='路由id'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            唯一标识，微服务路由即服务的applicationName
                          </Tooltip>}
                          rules={[
                            { required: true, min: 2, max: 64},
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                const pattern = /^[a-z]+[a-z\-]+[a-z]+$$/g;
                                if (!value || pattern.test(value)) {
                                  return Promise.resolve();
                                }
                                return Promise.reject('只允许小写字母和“-”，不能“-”开头或结尾');
                              },
                            })
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col md={5} xs={24}>
                        <Form.Item
                          name="serviceType"
                          label='路由类型'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            路由指向的服务类型
                          </Tooltip>}
                          rules={[
                            { required: true},
                          ]}
                        >
                          <Select allowClear placeholder="请选择路由类型">
                            <Select.Option value="SYSTEM">控制台服务</Select.Option>
                            <Select.Option value="CLIENT">WEB前端服务</Select.Option>
                            <Select.Option value="TOOL">工具类服务</Select.Option>
                            <Select.Option value="OTHER">其他</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col md={14} xs={0} />
                      <Col md={5} xs={24}>
                        <Form.Item
                          name="serviceCname"
                          label='中文名'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            用以直观的标识该路由指向的地方
                          </Tooltip>}
                          rules={[
                            { required: true, min: 2, max: 64},
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col md={5} xs={24}>
                        <Form.Item
                          name="uri"
                          label='路由uri'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            可以是内部的服务id，或者http/https的域名
                          </Tooltip>}
                          rules={[
                            { required: true, min: 2, max: 256},
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col md={5} xs={24}>
                        <Form.Item
                          name="orderNo"
                          label='排序'
                          tooltip={<Tooltip title=''>
                            排序序号，无太大实际作用
                          </Tooltip>}
                          rules={[
                            { required: true},
                          ]}
                        >
                          <InputNumber min={0} max={999} precision={0} />
                        </Form.Item>
                      </Col>
                      <Col md={5} xs={24}>
                        <Space size="large">
                          <Button shape="round" icon={<SaveOutlined />} type="primary" htmlType="submit" disabled={!hasChange} loading={loading}>
                            {
                              localFormInfo?.id ? '保存' : '新增'
                            }
                          </Button>
                          <Button shape="round" icon={<RollbackOutlined />} type="default" loading={loading} onClick={() => { history.push("/devOps/gatewayRoute")}}>返回</Button>
                          {
                            hasChange ? <Button
                              type="link"
                              icon={<RollbackOutlined />}
                              onClick={() => {
                                initFormInfo(localFormInfo);
                              }}
                            >
                              还原更改
                            </Button> : null
                          }
                        </Space>
                      </Col>
                    </Row>
                    <Form.Item
                      name="predicates"
                      label='断言配置'
                      hidden
                      rules={[
                        { required: true },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="filters"
                      label='过滤配置'
                      hidden
                      rules={[
                        { required: true },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Form>
                  <Row gutter={[32, 16]}>
                    <Col md={12} xs={24}>
                      <Divider orientation="left">断言配置</Divider>
                      <Button type="default" shape="round" icon={<PlusOutlined />} onClick={addPredicate}>新增配置</Button>
                      <div className={[`${styles.configMainDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
                        {
                          localPredicateConfig.length > 0 ?
                            <ul className={styles.mainUlStyle}>
                              {
                                predicateNodeArr
                              }
                            </ul>
                            :
                            <Result
                              status="info"
                              title="暂无配置"
                              subTitle="目前还没有断言配置，请点击上方新增一条"
                            />
                        }
                      </div>
                    </Col>
                    <Col md={12} xs={24}>
                      <Divider orientation="left">过滤配置</Divider>
                      <Button type="default" shape="round" icon={<PlusOutlined />}  onClick={addFilter}>新增配置</Button>
                      <div className={[`${styles.configMainDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
                        {
                          localFilterConfig.length > 0 ?
                            <ul className={styles.mainUlStyle}>
                              {
                                filterNodeArr
                              }
                            </ul>
                            :
                            <Result
                              status="info"
                              title="暂无配置"
                              subTitle="目前还没有过滤配置，请点击上方新增一条"
                            />
                        }
                      </div>
                    </Col>
                  </Row>
                </div>
            }
          </>
      }
      <PropertiesDetailModal
        showModal={showProperties}
        contentObj={propertiesMap}
        maskClosable={false}
        onCloseModal={closePropertiesModal}
        onSubmitValue={submitPropertiesModal}
      />
    </PageContainer>
  );
};

export default UpdateGatewayRoute;
