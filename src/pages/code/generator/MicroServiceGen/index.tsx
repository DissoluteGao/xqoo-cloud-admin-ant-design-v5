import {PageContainer} from "@ant-design/pro-layout";
import React, {useEffect, useState} from "react";
import {Button, Col, Divider, Form, Input, message, Modal, Result, Row, Space, Spin, Tooltip, Tree} from "antd";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {FundViewOutlined, NodeCollapseOutlined, CloudDownloadOutlined, ReloadOutlined} from "@ant-design/icons";
import {IndexTree, MicroServiceGenerator, PreviewCode} from "@/pages/code/generator/data";
import {downloadCodeZip, microServiceGeneratorCode} from "@/pages/code/generator/service";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import {Prism} from "react-syntax-highlighter";
import {find as _find} from 'lodash';
import styles from '@/pages/code/generator/MicroServiceGen/index.less'

const { DirectoryTree } = Tree;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 10 },
    sm: { span: 10 },
    md: { span: 15 },
  },
};

const MicroServiceGen: React.FC<{}> = () => {
  const [microServiceGenForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [codePreviewList, setCodePreviewList] = useState<PreviewCode[]>([]);
  const [downloadKey, setDownloadKey] = useState<string>("");
  const [genCodeHasError, setGenCodeHasError] = useState<boolean>(false);
  const [genCodeErrorMessage, setGenCodeErrorMessage] = useState<string>("");
  const [generatorFinish, setGeneratorFinish] = useState<boolean>(false);
  const [indexTreeData, setIndexTreeData] = useState<IndexTree[]>([]);
  const [checkFileType, setCheckFileType] = useState<string>("java");
  const [checkFileContent, setCheckFileContent] = useState<string>("");
  const [checkFileName, setCheckFileName] = useState<string>("预览文件");
  const [defaultOpenExpand, setDefaultOpenExpand] = useState<string[]>([]);

  // 初始化默认展开
  const initDefaultOpen = (openArr: string[], indexArr: IndexTree[]): string[] => {
    indexArr.forEach((item) => {
      if (item.children) {
        openArr.push(String(item.key));
        openArr.concat(initDefaultOpen(openArr, item.children));
      }
    });
    return openArr;
  };

  useEffect(() => {
    if(indexTreeData.length > 0){
      const arr = initDefaultOpen([], indexTreeData);
      setDefaultOpenExpand(arr);
    }
  }, [indexTreeData]);

  // 重置所有区域
  const resetAll = () => {
    setLoading(false);
    setCodePreviewList([]);
    setDownloadKey("");
    setGenCodeHasError(false);
    setGenCodeErrorMessage("");
    setGeneratorFinish(false);
    setIndexTreeData([]);
    setCheckFileName("预览文件");
    setCheckFileContent("");
    microServiceGenForm.setFieldsValue({
      moduleName: "",
      modulePort: "",
      nacosNameSpace: ""
    });
  };

  // 区别生成代码或预览代码
  const confirmGeneratorCode = (needDownload: boolean) => {
    microServiceGenForm.validateFields().then(res => {
      if(needDownload){
        Modal.confirm({
          okText: '确认',
          cancelText: '取消',
          title: '确认信息',
          content: '确定生成代码？',
          onOk: () => {
            tellServerGeneratorCode(res, needDownload);
          },
        });
      }else{
        tellServerGeneratorCode(res, needDownload);
      }
    })
  };

  // 表单提交
  const onFinish = (values: any) => {

  };

  const downloadCodeFile = () => {
    setLoading(true);
    downloadCodeZip(encodeURIComponent(downloadKey)).then(res => {
      setLoading(false);
      const aLink = document.createElement('a');
      const blob = new Blob([res], {type: 'application/zip'});
      // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
      let fileName = `${microServiceGenForm.getFieldValue('moduleName')}.zip`;
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

  // 生成代码
  const tellServerGeneratorCode = (formValue: any, needDownload: boolean) => {
    setLoading(true);
    const submitData: MicroServiceGenerator = {
      moduleName: formValue.moduleName,
      modulePort: formValue.modulePort,
      nacosNameSpace: formValue.nacosNameSpace,
      needDownload: needDownload,
      templateNameArr: [formValue.templateNameArr]
    };
    microServiceGeneratorCode(submitData).then(res => {
      setLoading(false);
      if(res.code === 200){
        setGenCodeHasError(false);
        setDownloadKey(res.data?.downLoadKey || "");
        setCodePreviewList(res.data?.previewCodeList || []);
        setIndexTreeData(res.data?.indexTree || []);
        setGeneratorFinish(true);
        scrollToAnchor("codePreviewBottom");
        message.success("生成完成");
      }else{
        setGeneratorFinish(false);
        setGenCodeHasError(true);
        setGenCodeErrorMessage(res.message);
      }
    }).catch(e=> {
      setGeneratorFinish(false);
      setLoading(false);
    });
  };

  const onSelect = (keys: any, event: any) => {
    if(event.node.previewCodeIndex || event.node.previewCodeIndex == 0){
      const obj: PreviewCode|undefined = _find(codePreviewList, (item) => {return item.index === event.node.previewCodeIndex});
      if(obj){
        setCheckFileType(obj.fileType || 'diff');
        setCheckFileContent(obj.content);
        setCheckFileName(obj.fileName || "预览文件");
      }
    }
  };

  const onExpand = (expandedKeys: any[]) => {
    setDefaultOpenExpand(expandedKeys);
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

  return (
    <PageContainer fixedHeader>
      <div className={styles.formDiv}>
        <Divider orientation='left'>填写生成参数</Divider>
        <Row>
          <Col span={24}>
            <Form
              {...formItemLayout}
              form={microServiceGenForm}
              name="microServiceGen"
              layout="inline"
              initialValues={{templateNameArr: 'microService'}}
              validateMessages={ValidateMessages}
              onFinish={onFinish}
            >
              <Form.Item
                name="moduleName"
                label='模块名'
                hasFeedback
                tooltip={<Tooltip title=''>
                  生成的服务模块名，只能为小写字母+ '-'隔开
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
                <Input disabled={generatorFinish} />
              </Form.Item>
              <Form.Item
                name="modulePort"
                label='模块端口'
                hasFeedback
                tooltip={<Tooltip title=''>
                  启动模块搜哦使用的端口，只能为数字
                </Tooltip>}
                rules={[
                  { required: true, min: 2, max: 9},
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const pattern = /^[1-9]\d*$/g;
                      if (!value || pattern.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject('只能输入正整数');
                    },
                  })
                ]}
              >
                <Input disabled={generatorFinish} />
              </Form.Item>
              <Form.Item
                name="templateNameArr"
                label='所用模板'
                hasFeedback
                tooltip={<Tooltip title=''>
                  所选用的模板
                </Tooltip>}
                rules={[
                  { required: true }]}
              >
                <Input readOnly disabled />
              </Form.Item>
              <Form.Item
                name="nacosNameSpace"
                label='命名空间'
                hasFeedback
                tooltip={<Tooltip title=''>
                  模块配置文件对应nacos的命名空间，不填则使用默认值
                </Tooltip>}
                rules={[
                  { min: 2, max: 64}]}
              >
                <Input disabled={generatorFinish} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
      <div style={{padding: '25px'}}>
        {
          genCodeHasError ?
            <Button
              type="primary"
              shape="round"
              loading={loading}
              onClick={() => {confirmGeneratorCode(true)}}>
              重试
            </Button>
            :
            <>
              {
                generatorFinish ?
                  <Space>
                    {
                      downloadKey && downloadKey.trim() !== '' ?
                        <Button
                          type="primary"
                          danger
                          shape="round"
                          icon={<CloudDownloadOutlined />}
                          loading={loading}
                          onClick={() => {
                            downloadCodeFile()
                          }}
                        >
                          下载代码
                        </Button>
                        :
                        <Space>
                          <Button
                            type="primary"
                            shape="round"
                            icon={<NodeCollapseOutlined />}
                            loading={loading}
                            onClick={() => {confirmGeneratorCode(true)}}
                          >
                            生成代码
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
                    }
                  </Space>
                  :
                  <Space>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<NodeCollapseOutlined />}
                      loading={loading}
                      onClick={() => {confirmGeneratorCode(true)}}
                    >
                      生成代码
                    </Button>
                    <Button
                      type="primary"
                      danger
                      shape="round"
                      icon={<FundViewOutlined />}
                      loading={loading}
                      onClick={() => {confirmGeneratorCode(false)}}
                    >
                      仅预览
                    </Button>
                  </Space>
              }
            </>
        }
      </div>
      <Row gutter={[16, 0]}>
        {
          genCodeHasError ?
            <Col span={24} className={styles.colDiv}>
              <div className={styles.generatorCodeDiv}>
                <Result
                  key='genErrorResult'
                  status="error"
                  title="生成代码失败"
                  subTitle={genCodeErrorMessage}
                  extra={
                    <Button
                      type="primary"
                      shape="round"
                      loading={loading}
                      onClick={() => {confirmGeneratorCode(true)}}>
                      重试
                    </Button>
                  }
                />
              </div>
            </Col>
            :
            <>
              <Col md={6} xs={24}>
                <div className={styles.colDiv}>
                  <Divider orientation='left'>文件目录</Divider>
                  <Spin spinning={loading} tip="正在生成...">
                    <div className={[`${styles.generatorCodeDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
                    {
                      generatorFinish ?
                        <DirectoryTree
                          multiple
                          expandedKeys={defaultOpenExpand}
                          onExpand={onExpand}
                          onSelect={onSelect}
                          treeData={indexTreeData}
                        />
                        :
                        <Result
                          key='unGenCode'
                          status="info"
                          title="请先生成文件"
                          subTitle="请先生成文件之后才出现文件结构树"
                        />
                    }
                  </div>
                  </Spin>
                </div>
              </Col>
              <Col md={18} xs={24}>
                <div className={styles.colDiv}>
                  <Divider orientation='left'>{checkFileName}</Divider>
                  {
                    checkFileContent ?
                      <div className={[`${styles.generatorCodeDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
                        <Prism
                          showLineNumbers
                          startingLineNumber={1}
                          language={checkFileType}
                          wrapLines
                          style={vscDarkPlus}
                        >
                          {checkFileContent}
                        </Prism>
                      </div>
                      :
                      <div className={styles.generatorCodeDiv}>
                        <Result
                          key='uncheckFile'
                          status="info"
                          title="请先选择文件"
                          subTitle="请在左侧选择一个文件进行预览"
                        />
                      </div>
                  }
                </div>
              </Col>
            </>
        }
      </Row>
      <a href="#" id="codePreviewBottom" />
    </PageContainer>
  );
};

export default MicroServiceGen;
