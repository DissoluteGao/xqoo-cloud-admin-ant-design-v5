import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
  CodeSandboxOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs, Row, Col } from 'antd';
import React, {useEffect, useState} from 'react';
import ProForm, { ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import {
  passwordLogin,
  getFakeCaptcha,
  LoginParamsType,
  LoginSourceEnum,
  LoginTypeEnum,
} from '@/services/login';

import { setCacheCurrentUser } from '@/services/user';
import { randomString } from '@/utils/utils';
import { aesEncode } from '@/utils/aes/aesUtil';
import moment from 'moment';
import { loopMenuItem } from '@/utils/route/menuHandleTool';
import { getServerRoute } from '@/utils/route/serverRouteUtils';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {
  message.success('登录成功，即将跳转...');
  setTimeout(() => {
    if (!history) {
      return;
    }
    setTimeout(() => {
      const { query } = history.location;
      const { redirect } = query as { redirect: string };
      history.replace(redirect || '/');
    }, 100);
  }, 2000);
};

const Login: React.FC<{}> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const setMenuData = async (currentUser: API.CurrentUser) => {
    setInitialState({
      ...initialState,
      menuData: [],
      settings: {
        title: '获取资源...',
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
      currentUser,
      settings: {
        title: 'xqoo-console',
        menu: {
          locale: false,
          loading: false,
        },
      },
    });
  };
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [type, setType] = useState<string>('account');
  const [form] = ProForm.useForm();
  const intl = useIntl();
  const setCurrentUser = async (obj: API.LoginStateType): Promise<API.CurrentUser | undefined> => {
    if (obj && obj.data && obj.data.token) {
      await setCacheCurrentUser(obj.data);
      return obj.data;
    }
    return undefined;
  };
  useEffect(() => {
    form.resetFields();
  }, []);
  const handleSubmit = async (values: LoginParamsType) => {
    const valueIn = values;
    setSubmitting(true);
    valueIn.loginSource = LoginSourceEnum.PcBrowser;
    valueIn.loginType = LoginTypeEnum.PASSWORD;
    valueIn.randomStr = randomString(6, undefined);
    const passwordSecretObj: API.PasswordSecret = {};
    passwordSecretObj.password = valueIn.password;
    passwordSecretObj.randomStr = valueIn.randomStr;
    passwordSecretObj.time = moment().valueOf();
    valueIn.password = encodeURIComponent(aesEncode(JSON.stringify(passwordSecretObj)));
    try {
      // 登录
      const msg = await passwordLogin({ ...valueIn });
      if (msg.code === 200) {
        const currentUser = await setCurrentUser(msg);
        if (!currentUser) {
          msg.code = 406;
          msg.message = '获取当前登录用户信息失败，请重试';
          return;
        }
        await setMenuData(currentUser);
        goto();
        return;
      }
      form.setFieldsValue({
        password: '',
        errorCode: '',
      });
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      console.error(error);
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  const { code, message: loginType, data } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg" />
              <span className={styles.title}>Ant Design</span>
            </Link>
          </div>
          <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
        </div>

        <div className={styles.main}>
          <ProForm
            form={form}
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                })}
              />
              <Tabs.TabPane
                key="mobile"
                tab={intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                })}
              />
            </Tabs>

            {code && code !== 200 && (
              <LoginMessage
                content={userLoginState.message ? userLoginState.message : '登录错误'}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="loginId"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.loginId.placeholder',
                    defaultMessage: '请输入您的用户名',
                  })}
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockTwoTone className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                    defaultMessage: '请输入密码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="请输入密码！"
                        />
                      ),
                    },
                  ]}
                />
                {code === 412 && (
                  <Row>
                    <Col span={14}>
                      <ProFormText
                        name="errorCode"
                        fieldProps={{
                          size: 'large',
                          prefix: <CodeSandboxOutlined className={styles.prefixIcon} />,
                        }}
                        placeholder={intl.formatMessage({
                          id: 'pages.login.errCode.placeholder',
                          defaultMessage: '请输入验证码',
                        })}
                        rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.login.errCode.required"
                                defaultMessage="请输入验证码"
                              />
                            ),
                          },
                        ]}
                      />
                    </Col>
                    <Col span={8} offset={2}>
                      <div className={styles.captchaDiv}>{data?.errCode}</div>
                    </Col>
                  </Row>
                )}
              </>
            )}

            {code === 512 && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileTwoTone className={styles.prefixIcon} />,
                  }}
                  name="mobile"
                  placeholder={intl.formatMessage({
                    id: 'pages.login.phoneNumber.placeholder',
                    defaultMessage: '手机号',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.required"
                          defaultMessage="请输入手机号！"
                        />
                      ),
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.invalid"
                          defaultMessage="手机号格式错误！"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <MailTwoTone className={styles.prefixIcon} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.captcha.placeholder',
                    defaultMessage: '请输入验证码',
                  })}
                  captchaTextRender={(timing, count) =>
                    timing
                      ? `${count} ${intl.formatMessage({
                          id: 'pages.getCaptchaSecondText',
                          defaultMessage: '获取验证码',
                        })}`
                      : intl.formatMessage({
                          id: 'pages.login.phoneLogin.getVerificationCode',
                          defaultMessage: '获取验证码',
                        })
                  }
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.captcha.required"
                          defaultMessage="请输入验证码！"
                        />
                      ),
                    },
                  ]}
                  onGetCaptcha={async (mobile) => {
                    const result = await getFakeCaptcha(mobile);
                    if (result === false) {
                      return;
                    }
                    message.success('获取验证码成功！验证码为：1234');
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 24,
              }}
            >
              {/* <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </ProFormCheckbox> */}
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </div>
          </ProForm>
          <Space className={styles.other}>
            <FormattedMessage id="pages.login.loginWith" defaultMessage="其他登录方式" />
            <AlipayCircleOutlined className={styles.icon} />
            <TaobaoCircleOutlined className={styles.icon} />
            <WeiboCircleOutlined className={styles.icon} />
          </Space>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
