import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Col, Divider, Form, Input, Row, Space, Button, Select, Tooltip, message, Result, Modal} from "antd";
import {PlusOutlined, MinusCircleOutlined, NodeCollapseOutlined, ReloadOutlined, CloudDownloadOutlined} from '@ant-design/icons';
import {camelCase as _camelCase} from 'lodash';
import {EntityCodeGenerator, PreviewCode} from "@/pages/code/generator/data";
import {downloadCodeZip, entityGeneratorCode} from "@/pages/code/generator/service";
import {Prism} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from '@/pages/code/generator/EntityGen/index.less'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const EntityGen: React.FC<{}> = () => {
  const [entityGenForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [codePreviewList, setCodePreviewList] = useState<PreviewCode[]>([]);
  const [downloadKey, setDownloadKey] = useState<string>("");
  const [genCodeHasError, setGenCodeHasError] = useState<boolean>(false);
  const [genCodeErrorMessage, setGenCodeErrorMessage] = useState<string>("");
  const [generatorFinish, setGeneratorFinish] = useState<boolean>(false);
  const [checkFileContent, setCheckFileContent] = useState<string>("");
  const [checkFileName, setCheckFileName] = useState<string>("代码预览");

  useEffect(() => {
    if(codePreviewList.length === 1){
      setCheckFileName(entityGenForm.getFieldValue("className") + '.java');
      setCheckFileContent(codePreviewList[0].content);
    }
  }, [codePreviewList]);

  // 重置所有区域
  const resetAll = () => {
    setLoading(false);
    setCodePreviewList([]);
    setDownloadKey("");
    setGenCodeHasError(false);
    setGenCodeErrorMessage("");
    setGeneratorFinish(false);
    setCheckFileName("预览文件");
    setCheckFileContent("");
    entityGenForm.resetFields();
  };

  const downloadCodeFile = () => {
    setLoading(true);
    downloadCodeZip(encodeURIComponent(downloadKey)).then(res => {
      setLoading(false);
      const aLink = document.createElement('a');
      const blob = new Blob([res], {type: 'application/zip'});
      // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
      let fileName = `${entityGenForm.getFieldValue('className')}.zip`;
      aLink.href = URL.createObjectURL(blob);
      aLink.setAttribute('download', fileName); // 设置下载文件名称
      document.body.appendChild(aLink);
      aLink.click();
      document.body.appendChild(aLink);
    }).catch(e => {
      setLoading(false);
      message.error('下载文件失败，请稍后重试')
      console.error('downloadFile error !', e);
    });
  };

  const onFinish = (values: any) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '确定生成代码？',
      onOk: () => {
        tellServerGeneratorCode(values);
      },
    });
  };

  // 生成代码
  const tellServerGeneratorCode = (formValue: any) => {
    setLoading(true);
    const submitData: EntityCodeGenerator = {
      className: formValue.className,
      classComment: formValue.classComment,
      properties: formValue.properties,
      templateNameArr: ['singleEntity']
    };
    entityGeneratorCode(submitData).then(res => {
      setLoading(false);
      setCheckFileName("正在生成...");
      if(res.code === 200){
        setGenCodeHasError(false);
        setDownloadKey(res.data?.downLoadKey || "");
        setCodePreviewList(res.data?.previewCodeList || []);
        setGeneratorFinish(true);
        message.success("生成完成");
      }else{
        setCheckFileName("生成失败");
        setGeneratorFinish(false);
        setGenCodeHasError(true);
        setGenCodeErrorMessage(res.message);
      }
    }).catch(e=> {
      setCheckFileName("生成失败");
      setGeneratorFinish(false);
      setLoading(false);
    });
  };

  return(
    <PageContainer fixedHeader>
      <Row gutter={[24,24]}>
        <Col md={10} xs={24}>
          <div className={styles.backGroundDiv}>
            <Divider orientation="left">填写关键参数</Divider>
            <Form form={entityGenForm} name="dynamic_form_nest_item" layout="horizontal" onFinish={onFinish}>
              <Form.Item
                name="className"
                label='类名'
                hasFeedback
                style={{width: '60%'}}
                tooltip={<Tooltip title=''>
                  类名，为生成的实体名称标注
                </Tooltip>}
                rules={[
                  { required: true, min: 2, max: 32},
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const pattern = /^[A-Z]+[A-Za-z]+$$/g;
                      if (!value || pattern.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject('只允许小写字母大写字母,首字母必须大写');
                    },
                  })
                ]}
              >
                <Input disabled={generatorFinish} />
              </Form.Item>
              <Form.Item
                name="classComment"
                label='注释'
                hasFeedback
                style={{width: '80%'}}
                tooltip={<Tooltip title=''>
                  类注释说明
                </Tooltip>}
                rules={[
                  { required: true, min: 2, max: 64}
                ]}
              >
                <Input disabled={generatorFinish} />
              </Form.Item>
              <Form.Item>
                {
                  generatorFinish ?
                    <Space>
                      <Button
                        type="primary"
                        shape="round"
                        danger
                        icon={<CloudDownloadOutlined />}
                        loading={loading}
                        onClick={() => {
                          downloadCodeFile()
                        }}
                      >
                        下载代码
                      </Button>
                      <Button
                        type="default"
                        shape="round"
                        icon={<ReloadOutlined />}
                        loading={loading}
                        onClick={resetAll}
                      >
                        重置
                      </Button>
                    </Space>
                    :
                    <Button
                      type="primary"
                      shape="round"
                      icon={<NodeCollapseOutlined />}
                      loading={loading}
                      disabled={generatorFinish}
                      htmlType="submit"
                    >
                      生成代码
                    </Button>
                }
              </Form.Item>
              <div className={[`${styles.propertiesFormDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
                <Form.List
                  name="properties"
                  rules={[
                    {
                      validator: async (_, names) => {
                        if (!names || names.length < 1) {
                          return Promise.reject(new Error('至少添加一个参数'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      <Form.ErrorList errors={errors} />
                      {fields.map((field, index) => (
                        <Form.Item
                          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                          label={index === 0 ? '参数列表' : ''}
                          required={false}
                          key={field.key}
                        >
                          <Space key={field.key} style={{ display: 'flex' }} align="baseline">
                            <Form.Item
                              {...field}
                              name={[field.name, 'javaFieldType']}
                              fieldKey={[field.fieldKey, 'javaFieldType']}
                              rules={[{ required: true, message: '请选择参数类型' }]}
                            >
                              <Select placeholder="请选择参数类型" showSearch style={{width: '100%'}} disabled={generatorFinish}>
                                <Select.Option value="String">String</Select.Option>
                                <Select.Option value="Date">Date</Select.Option>
                                <Select.Option value="Boolean">Boolean</Select.Option>
                                <Select.Option value="Map">Map</Select.Option>
                                <Select.Option value="List">List</Select.Option>
                                <Select.Option value="Set">Set</Select.Option>
                                <Select.Option value="Double">Double</Select.Option>
                                <Select.Option value="Float">Float</Select.Option>
                                <Select.Option value="Integer">Integer</Select.Option>
                                <Select.Option value="BigDecimal">BigDecimal</Select.Option>
                                <Select.Option value="ObjectNode">ObjectNode</Select.Option>
                                <Select.Option value="JsonNode">JsonNode</Select.Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'javaFieldName']}
                              fieldKey={[field.fieldKey, 'javaFieldName']}
                              rules={[{ required: true, message: '请现写字段名' },
                                ({ getFieldValue }) => ({
                                  validator(rule, value) {
                                    const pattern = /^[a-z]+[A-Za-z_]+[a-z]+$$/g;
                                    if (!value || pattern.test(value)) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject('只允许小写字母大写字母和下划线,头尾为不能为_和大写字母');
                                  },
                                })
                              ]}
                            >
                              <Input disabled={generatorFinish} placeholder="字段名" style={{width: '100%'}} />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'comment']}
                              fieldKey={[field.fieldKey, 'comment']}
                            >
                              <Input disabled={generatorFinish} placeholder="请填写注释说明" style={{width: '100%'}} />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                          </Space>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button disabled={generatorFinish} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          添加参数
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            </Form>
          </div>
        </Col>
        <Col md={14} xs={24}>
          <div className={styles.backGroundDiv}>
            <Divider orientation="left">{checkFileName}</Divider>
            {
              checkFileContent ?
                <div className={[`${styles.propertiesFormDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
                  <Prism
                    showLineNumbers
                    startingLineNumber={1}
                    language="java"
                    wrapLines
                    style={vscDarkPlus}
                  >
                    {checkFileContent}
                  </Prism>
                </div>
                :
                <div className={styles.propertiesFormDiv}>
                  {
                    genCodeHasError ?
                      <Result
                        key='GenFileErr'
                        status="error"
                        title="生成发生错误"
                        subTitle={genCodeErrorMessage}
                        extra={
                          <Button
                            type="primary"
                            shape="round"
                            loading={loading}
                            onClick={() => {onFinish(entityGenForm.submit())}}>
                            重试
                          </Button>
                        }
                      />
                      :
                      <Result
                        key='unGenFile'
                        status="info"
                        title="请填写左侧信息"
                        subTitle="请填写左侧信息后生成一个文件"
                      />
                  }
                </div>
            }
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default EntityGen;
