import React, {ReactNodeArray, useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Col, Divider, Result, Row, Checkbox, Tooltip, Form, Modal, Input, Button, message, Space, Alert} from "antd";
import DataSourceList from "@/pages/code/generator/TableGen/components/DataSourceList";
import TableInfoList from "@/pages/code/generator/TableGen/components/TableInfoList";
import ColumnInfoList from "@/pages/code/generator/TableGen/components/ColumnInfoList";
import {ColumnEntity, TableEntity} from "@/pages/code/generator/data";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {NodeCollapseOutlined, CloudDownloadOutlined, FundViewOutlined} from "@ant-design/icons";
import {camelCase as _camelCase} from 'lodash';
import {GenCodeEntity, PreviewCode, TemplateInfo} from "@/pages/code/generator/data";
import {downloadCodeZip, getTemplateInfo, tableGeneratorCode} from "@/pages/code/generator/service";
import CodePreview from "@/pages/code/generator/TableGen/components/CodePreview";
import styles from "./index.less";



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

const TableGen: React.FC<{}> = () => {
  const [tableCodeGenForm] = Form.useForm();
  const [checkedDataSourceId, setCheckedDataSourceId] = useState<number>(0);
  const [checkedTableName, setCheckedTableName] = useState<string>("");
  const [checkedTableItem, setCheckedTableItem] = useState<TableEntity>();
  const [checkedColumnDataArr, setCheckedColumnDataArr] = useState<ColumnEntity[]>([]);
  const [showGeneratorOption, setShowGeneratorOption] = useState<boolean>(false);
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);
  const [checkedTemplate, setCheckedTemplate] = useState<any[]>([]);
  const [localTemplateInfo, setLocalTemplateInfo] = useState<TemplateInfo[]>([]);
  const [templateOptions, setTemplateOptions] = useState<any[]>([]);
  const [generatorLoading, setGeneratorLoading] = useState<boolean>(false);
  const [codePreviewList, setCodePreviewList] = useState<PreviewCode[]>([]);
  const [downloadKey, setDownloadKey] = useState<string>("");
  const [genCodeHasError, setGenCodeHasError] = useState<boolean>(false);
  const [genCodeErrorMessage, setGenCodeErrorMessage] = useState<string>("");
  const [generatorFinish, setGeneratorFinish] = useState<boolean>(false);

  const queryTemplateInfo = () => {
    setTemplateLoading(true);
    getTemplateInfo('tableGen').then(res => {
      setTemplateLoading(false);
      if(res.code === 200){
        setLocalTemplateInfo(res.data || []);
        generatorTemplateOptions(res.data || []);
      }else{
        message.warning(`获取模板失败:${res.message}`)
      }
    }).catch(e => {
      setTemplateLoading(false);
      message.warning(`获取模板失败,请刷新页面重试`)
    });
  };

  const downloadCodeFile = () => {
    setGeneratorLoading(true);
    downloadCodeZip(encodeURIComponent(downloadKey)).then(res => {
      setGeneratorLoading(false);
      const aLink = document.createElement('a');
      const blob = new Blob([res], {type: 'application/zip'});
      // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
      let fileName = `${_camelCase(checkedTableName)}.zip`;
      aLink.href = URL.createObjectURL(blob);
      aLink.setAttribute('download', fileName); // 设置下载文件名称
      document.body.appendChild(aLink);
      aLink.click();
      document.body.appendChild(aLink);
    }).catch(e => {
      setGeneratorLoading(false);
      message.error('下载文件失败，请稍后重试')
      console.error('downloadFile error !', e);
    });
  };

  useEffect(() => {
    setCheckedDataSourceId(0);
    setCheckedTableName("");
    setCheckedColumnDataArr([]);
  }, []);

  useEffect(() => {
    setGenCodeHasError(false);
    if(checkedDataSourceId > 0 && checkedTableName && checkedColumnDataArr.length > 0){
      setShowGeneratorOption(true);
      tableCodeGenForm.setFieldsValue({packageName: 'com.xqoo.codegen', handleName: `${_camelCase(checkedTableName)}Handle`});
      queryTemplateInfo();
    }else{
      setShowGeneratorOption(false);
    }
    setGeneratorFinish(false);
  }, [checkedColumnDataArr]);


  useEffect(() => {
    if(localTemplateInfo.length > 0){
      const tmpArr: any[] = [];
      localTemplateInfo.forEach(item => {
        tmpArr.push(item.value);
      });
      setCheckedTemplate(tmpArr);
    }
  }, [localTemplateInfo]);



  const checkedResourceId = (id: number) => {
    setCheckedDataSourceId(id);
    setCheckedTableName("");
    setCheckedColumnDataArr([]);
  };

  const checkedDataTableName = (tableName: string) => {
    setCheckedTableName(tableName);
  };

  const checkedDataTableItem = (table: TableEntity) => {
    setCheckedTableItem(table);
  };

  const checkedColumnData = (columnData: ColumnEntity[]) => {
    setCheckedColumnDataArr(columnData);
  };

  const onTemplateChange = (checkedValue: any[]) => {
    setCheckedTemplate(checkedValue);
  };

  const generatorTemplateOptions = (arr: TemplateInfo[]): void => {
    const tmpArr: ReactNodeArray = [];
    arr.forEach(item => {
      tmpArr.push(
        <Col key={item.value} md={8} xs={12}>
          <div className={styles.ellipsis}>
            <Checkbox value={item.value}>
              <Tooltip title={item.label} overlay={undefined}>
                {item.label}
              </Tooltip>
            </Checkbox>
          </div>
        </Col>
      );
    });
    setTemplateOptions(tmpArr);
  };



  // 表单提交
  const onFinish = (values: any) => {

  };

  const judgeButtonDisabled = (): boolean => {
    if(!checkedDataSourceId || !checkedTableName){
      return true;
    }
    if(checkedColumnDataArr.length < 1){
      return true;
    }
    return checkedTemplate.length < 1;

  };

  // 区别生成代码或预览代码
  const confirmGeneratorCode = (needDownload: boolean) => {
    tableCodeGenForm.validateFields().then(res => {
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

  // 生成代码
  const tellServerGeneratorCode = (formValue: any, needDownload: boolean) => {
    setGeneratorLoading(true);
    if(!checkedDataSourceId || !checkedTableName){
      message.warning("未选择数据源或数据表，无法生成");
      return;
    }
    if(checkedColumnDataArr.length < 1){
      message.warning("未选择生成字段，无法生成");
      return;
    }
    if(checkedTemplate.length < 1){
      message.warning("未选择生成模板，无法生成");
      return;
    }
    const submitData: GenCodeEntity = {
      handleName: formValue.handleName,
      className: formValue.className,
      columnDataArr: checkedColumnDataArr,
      dataSourceId: checkedDataSourceId,
      packageName: formValue.packageName,
      tableName: checkedTableName,
      tableItem: checkedTableItem,
      templateNameArr: checkedTemplate,
      needDownload: needDownload
    };
    tableGeneratorCode(submitData).then(res => {
      setGeneratorLoading(false);
      if(res.code === 200){
        setGenCodeHasError(false);
        setDownloadKey(res.data?.downLoadKey || "");
        setCodePreviewList(res.data?.previewCodeList || []);
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
      setGeneratorLoading(false);
    });
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
      <Row gutter={[24, 24]}>
        <Col md={8} xs={24}>
          <div className={styles.mainDiv}>
            <DataSourceList onCheckResourceId={checkedResourceId} />
          </div>
        </Col>
        <Col md={8} xs={24}>
          <div className={styles.mainDiv}>
            <TableInfoList
              dataSourceId={checkedDataSourceId}
              onCheckTableName={checkedDataTableName}
              onCheckTableItem={checkedDataTableItem}
            />
          </div>
        </Col>
        <Col md={8} xs={24}>
          <div className={styles.mainDiv}>
            <ColumnInfoList dataSourceId={checkedDataSourceId} tableName={checkedTableName} onCheckedColumnInfo={checkedColumnData} />
          </div>
        </Col>
        <Col span={24}>
          {
            showGeneratorOption ?
              <div className={styles.codeGenMainDiv}>
                <Row gutter={[16, 16]}>
                  <Col md={8} xs={24}>
                    <Divider orientation='left'>请选择生成模板</Divider>
                    <div className={[`${styles.generatorConfigDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
                      {
                        templateOptions.length > 0 ?
                          <Checkbox.Group style={{width: '100%'}} value={checkedTemplate} onChange={onTemplateChange}>
                            <Row>
                              {
                                templateOptions
                              }
                            </Row>
                          </Checkbox.Group>
                          :
                          <Result
                            key='noTemplateResult'
                            status="info"
                            title="无数据"
                            subTitle="暂无模板数据"
                            extra={
                              <Button type="primary" loading={templateLoading} onClick={queryTemplateInfo}>
                                刷新
                              </Button>
                            }
                          />
                      }
                    </div>
                  </Col>
                  <Col md={8} xs={24}>
                    <Divider orientation='left'>填写生成参数</Divider>
                    <div className={[`${styles.generatorConfigDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
                      <Form
                        {...formItemLayout}
                        form={tableCodeGenForm}
                        name="tableCodeGen"
                        validateMessages={ValidateMessages}
                        onFinish={onFinish}
                      >
                        <Form.Item
                          name="packageName"
                          label='包名'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            此值仅作为生成代码依赖的基础包，实际使用可能还需要更改，此处仅作为初始值
                          </Tooltip>}
                          rules={[
                            { required: true, min: 2, max: 32}]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="handleName"
                          label='业务名'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            此项主要用于标识controller层的路由
                          </Tooltip>}
                          rules={[
                            { required: true, min: 2, max: 64},
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                const pattern = /[A-Za-z0-9]+$/g;
                                if (!value || pattern.test(value)) {
                                  return Promise.resolve();
                                }
                                return Promise.reject('只能输入字母和数字');
                              },
                            })
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="className"
                          label='类名'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            此项若不填，则默认采用选中表的表名转驼峰式为类名前缀
                          </Tooltip>}
                          rules={[
                            { min: 2, max: 32}]}
                        >
                          <Input />
                        </Form.Item>
                      </Form>
                    </div>
                  </Col>
                  <Col md={8} xs={24}>
                    <Divider orientation='left'>生成代码</Divider>
                    {
                      generatorFinish ? null :
                        <Alert type="info" message="如不需要下载，点击【仅预览】生成速度更快"/>
                    }
                    {
                      generatorFinish && downloadKey ?
                        <Alert type="info" message="生成的代码包名或者引用路径可能不正确，请放到项目中自行修改"/>
                        :
                        null
                    }
                    {
                      genCodeHasError ?
                        <Result
                          key='genErrorResult'
                          status="error"
                          title="生成代码失败"
                          subTitle={genCodeErrorMessage}
                          extra={
                            <Button
                              type="primary"
                              shape="round"
                              disabled={judgeButtonDisabled()}
                              loading={generatorLoading}
                              onClick={() => {confirmGeneratorCode(true)}}>
                              重试
                            </Button>
                          }
                        />
                        :
                        <div className={[`${styles.generatorConfigDiv}`, `${styles.genToolDiv}`].join(' ')}>
                          <div className={styles.confirmGen}>
                            {
                              generatorFinish ?
                                <span>
                                  {
                                    downloadKey && downloadKey.trim() !== '' ?
                                      <Button
                                        type="primary"
                                        danger
                                        shape="round"
                                        icon={<CloudDownloadOutlined />}
                                        loading={generatorLoading}
                                        onClick={() => {
                                          downloadCodeFile()
                                        }}
                                      >
                                        下载代码
                                      </Button>
                                      :
                                      <Button
                                        type="primary"
                                        shape="round"
                                        icon={<NodeCollapseOutlined />}
                                        disabled={judgeButtonDisabled()}
                                        loading={generatorLoading}
                                        onClick={() => {confirmGeneratorCode(true)}}
                                      >
                                        生成代码
                                      </Button>
                                  }
                                </span>
                                :
                                <div>
                                  <Space>
                                    <Button
                                      type="primary"
                                      shape="round"
                                      icon={<NodeCollapseOutlined />}
                                      disabled={judgeButtonDisabled()}
                                      loading={generatorLoading}
                                      onClick={() => {confirmGeneratorCode(true)}}
                                    >
                                      生成代码
                                    </Button>
                                    <Button
                                      type="primary"
                                      danger
                                      shape="round"
                                      icon={<FundViewOutlined />}
                                      disabled={judgeButtonDisabled()}
                                      loading={generatorLoading}
                                      onClick={() => {confirmGeneratorCode(false)}}
                                    >
                                      仅预览
                                    </Button>
                                  </Space>
                                </div>
                            }
                          </div>
                        </div>
                    }
                  </Col>

                </Row>

              </div>
              :
              <div className={styles.mainDiv}>
                <Result
                  key='noTableResult'
                  status="info"
                  title="请先选择"
                  subTitle="请先选择有效的表字段"
                />
              </div>
          }

        </Col>
        {
          generatorFinish ?
            <Col span={24}>
              <div className={styles.codeViewDiv}>
                <Divider orientation="left">代码预览</Divider>
                {
                  codePreviewList.length > 0 ?
                    <CodePreview codePreviewList={codePreviewList} />
                    :
                    <Result
                      key='noPreviewCodeResult'
                      status="info"
                      title="没有预览"
                      subTitle="没有生成代码预览或没有相应模板"
                    />
                }
              </div>
            </Col>
            :
            null
        }
        <a href="#" id="codePreviewBottom" />
      </Row>
    </PageContainer>
  );
};

export default TableGen;
