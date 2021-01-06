import {PageContainer} from "@ant-design/pro-layout";
import React, {ReactNode, ReactNodeArray, useEffect} from "react";
import {Alert, Badge, Button, Card, Col, Descriptions, Empty, Result, Row, Space, Statistic, Tag, Tooltip} from "antd";
import {useModel} from "@@/plugin-model/useModel";
import {QuestionCircleOutlined, SyncOutlined} from "@ant-design/icons";
import ProSkeleton from '@ant-design/pro-skeleton';
import {LoginTypeSwitch} from "@/pages/devOps/AuthProperties/data";
import styles from './index.less'

const AuthProperties: React.FC<{}> = () => {
  const {authConfigInfo, loading, hasError, errorMessage, getConfigInfo} = useModel("devOps.AuthProperties.AuthCenterPropertiesModel");

  useEffect(() => {
    getConfigInfo();
  }, []);

  const generatorItemTitle = (title: string, helpText: string|ReactNode): ReactNode => {
    return <Space>
      {title}
      <Tooltip overlay={undefined} title={helpText}>
        <QuestionCircleOutlined />
      </Tooltip>
    </Space>
  };

  const generatorItemSecond = (second: number | undefined, unit: string): ReactNode => {
    return <Statistic title={`单位: ${unit}`} valueStyle={{ color: '#406dcf' }} value={second} formatter={(value) => {
      if(second){
        return <span>{second}</span>
      }
      return <span>未设置</span>
    } } />
  };

  const generateActive = (status: boolean|undefined): ReactNode => {
    if(status){
      return <Badge status="processing" color="green" text="开启" />
    }
    return <Badge color="red" text="关闭" />
  };

  const generateLoginTypeCard = (loginTypeSwitch: LoginTypeSwitch [] | undefined): ReactNodeArray => {
    const arr: ReactNodeArray = [];
    if(loginTypeSwitch) {
      loginTypeSwitch.forEach(item => {
        arr.push(<Card.Grid>
            <Row style={{width: '100%'}}>
              <Col span={12} style={{textAlign: 'right'}}>
                <span>模式：</span>
              </Col>
              <Col span={12} style={{textAlign: 'left'}}>
                <span>{getLoginTypeCname(item.type)}</span>
              </Col>
              <Col span={12} style={{textAlign: 'right'}}>
                <span>状态：</span>
              </Col>
              <Col span={12} style={{textAlign: 'left'}}>
                <span>{generateActive(item.active)}</span>
              </Col>
            </Row>
          </Card.Grid>
        )
      });
    }
    return arr;
  };

  const getLoginTypeCname = (type: string|undefined): string => {
    let name = '未知';
    if(!type){
      return name;
    }
    switch (type) {
      case 'PASSWORD':
        name = '密码模式';
        break;
      case 'QRCODE':
        name = '扫码登录';
        break;
      case 'PHONE':
        name = '手机验证码';
        break;
      case 'EMAIL':
        name = '邮箱验证码';
        break;
      case 'FINGER':
        name = '指纹验证登录';
        break;
      case 'FACE':
        name = '面部识别登录';
        break;
      case 'IDENTIFY':
        name = '证件扫描登录';
        break;
      case 'THIRDPARTY':
        name = '第三方授权登录';
        break;
      default:
        name = '未知';
    }
    return name;
  };

  return (
    <PageContainer fixedHeader content={<Button
      type="link"
      icon={<SyncOutlined />}
      loading={loading}
      onClick={getConfigInfo}
    >
      刷新
    </Button>}>
      {
        loading ? <ProSkeleton type="descriptions" />
        :
          hasError ?
            <div className={styles.mainDiv}>
              <Result
                status="error"
                title="发生错误"
                subTitle={errorMessage}
              />
            </div>
            :
            <div>
              <div>
                <Alert message="以下配置信息仅展示当前系统中所使用的配置，本页面不提供更改功能，如需更改请前往nacos配置中心进行修改" type="info" showIcon />
              </div>
              <div className={styles.mainDiv}>
                <div className={styles.itemDiv}>
                  <Descriptions title="token相关" bordered>
                    <Descriptions.Item label={generatorItemTitle('jwt秘钥', "此项用于jwt加密时的key，此处无法查看")}>
                      {authConfigInfo?.jwtSecretKey || '未设置'}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label={generatorItemTitle('jwt过期时间', "此项用于生成的jwt token设置默认的过期时间，" +
                      "当调用生成jwt token时未指定明确过期时间将使用此参数值")}>
                      { generatorItemSecond(((authConfigInfo?.jwtExpire || 0)/1000000), '秒') }
                    </Descriptions.Item>
                    <Descriptions.Item label={generatorItemTitle('token失效时间', "此项为登录token自动失效时限，到时自动踢出登录token")}>
                      { generatorItemSecond(authConfigInfo?.tokenExpire, '秒') }
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label={generatorItemTitle('token刷新时间',  <div>oken 刷新时间，小于此时间时刷新token持续时间，单位 s<br/>
                      为0时表示不刷新，到期即失效token<br/>
                      最小60，最大不超过失效时间一半</div>)}>
                      { generatorItemSecond(authConfigInfo?.tokenRefreshLimit, '秒') }
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <div className={styles.itemDiv}>
                  <Descriptions title="登录锁相关" bordered>
                    <Descriptions.Item label={generatorItemTitle('密码错误锁', "是否开启登录密码错误相关的锁定和验证码校验")}>
                      {generateActive(authConfigInfo?.loginErrLock.active)}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label={generatorItemTitle('错误验证次数', "当输入密码错误次数达到此限定值时，将开启验证码")}>
                      { generatorItemSecond(authConfigInfo?.loginErrLock.needCheckErrorTime, '次') }
                    </Descriptions.Item>
                    <Descriptions.Item label={generatorItemTitle('验证码失效', "当密码登录需要输入验证码时，验证码的过期时间")}>
                      { generatorItemSecond(authConfigInfo?.loginErrLock.errorCodeExpire, '分钟') }
                    </Descriptions.Item>
                    <Descriptions.Item label={generatorItemTitle('最大错误次数', '输入密码错误的最大次数，超过此次数时账户将在限定时间锁定无法登录')}>
                      { generatorItemSecond(authConfigInfo?.loginErrLock.maxErrorTime, '次') }
                    </Descriptions.Item>
                    <Descriptions.Item label={generatorItemTitle('锁定时间', '账号被锁定后的时间限制')}>
                      { generatorItemSecond(authConfigInfo?.loginErrLock.lockTime, '分钟') }
                    </Descriptions.Item>
                    <Descriptions.Item label={generatorItemTitle('时区校验', "是否开启时区校验，不同时区账号不允许登录")}>
                      {generateActive(authConfigInfo?.timeZoneCheck)}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label={generatorItemTitle('时间误差', "时间误差，当登录请求发送时间与服务器接收时间超过此误差值时，不允许登录，关闭时区校验后此项不可用，单位：秒")}>
                      { generatorItemSecond(authConfigInfo?.timeExact, '秒') }
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <div className={styles.itemDiv}>
                  <Descriptions title="登录设定相关" bordered>
                    <Descriptions.Item span={1} label={generatorItemTitle('单一登录', "是否开启单一登录模式，即一个账号同一时间内只允许登录一次")}>
                      {generateActive(authConfigInfo?.loginSingle)}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label={generatorItemTitle('单一登录限制', <>对单一登录的限制要求，全平台-即代表无论从何种来源登录，都只允许该账号登录一个<br />
                      来源限定-即可根据登录来源区分，例如APP端登录的同时，网页也可以登录，但不能再同时登录APP端
                    </>)}>
                      {
                        authConfigInfo?.loginSingleType === 'all' ?
                          <Tag color="#cd201f">全平台</Tag>
                          :
                          <Tag color="#55acee">来源限定</Tag>
                      }
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label={generatorItemTitle('登录类型', "此项主要为系统预设的一些登录方式是否被允许使用，关闭状态则无论是否具有该功能，都不允许登录")}>
                      <Card style={{ textAlign:'center' }}>
                        {
                          authConfigInfo?.loginTypeSwitch && authConfigInfo?.loginTypeSwitch.length > 0 ?
                            generateLoginTypeCard(authConfigInfo?.loginTypeSwitch)
                            :
                            <Empty />
                        }
                      </Card>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            </div>
      }
    </PageContainer>
  );
};

export default AuthProperties;
