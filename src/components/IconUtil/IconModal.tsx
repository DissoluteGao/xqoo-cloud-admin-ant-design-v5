import React, {ReactNode, ReactNodeArray, useState} from "react";
import {Col, Modal, Radio, Row, Tabs} from "antd";

import {CustomIconMap, IconModule} from "@/maps/IconMaps/CustomIconMap";
import styles from './IconModal.less';

export interface IconModalProps {
  showModal: boolean;
  titleText?: string;
  cssStyle?: any;
  cancelBtnText?: string;
  okBtnText?: string;
  footer?: ReactNode;
  maskClosable: boolean;
  modalWidth?: string | number;
  onCloseModal: () => void;
  onOkModal: () => void;
  onClickIcon: (value: string) => void;
}

const IconModal: React.FC<IconModalProps> = (props) => {
  const { showModal, titleText, cssStyle, footer, maskClosable, modalWidth, onCloseModal, onOkModal, onClickIcon } = props;
  const [checkedValue, setCheckedValue] = useState<any>('Outlined');
  const [defaultTabsKey, setDefaultTabsKey] = useState<string>(IconModule.iconTypeClassify.Outlined[0].value);

  // 点击tab的回调
  const onTabChange = (key: string) => {
    setDefaultTabsKey(key);
  };

  // 生成图标
  const generatorIconDiv = (data: string[]): ReactNodeArray => {
    const eleArr: ReactNodeArray = [];
    data.forEach((item: string) => {
      eleArr.push(
        <Col xs={6} md={2} key={item} className={styles.iconDivMain}>
          <div onClick={() => {onClickIcon(item)}}>
            <div className={styles.iconDivContent}>{CustomIconMap[item]}</div>
          </div>
        </Col>
      );
    })
    return eleArr;
  };

  // 生成tabPanes
  const generatorIconTabPane = (data: {label: string, value: string, mapping: string[]}[]): ReactNodeArray => {
    const eleArr: ReactNodeArray = [];
    data.forEach(item => {
      eleArr.push(
        <Tabs.TabPane tab={item.label} key={item.value}>
          <Row gutter={[26, 26]} className={[`${styles.tabsRowStyle}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
            {generatorIconDiv(item.mapping)}
          </Row>
        </Tabs.TabPane>
      );
    })
    return eleArr;
  };

  // 生成tabs
  const generatorIconTabs = (value: string): ReactNode => {
    const dataArr: {label: string, value: string, mapping: any[]}[] = IconModule.iconTypeClassify[value]
    return <Tabs className={styles.tabStyle} activeKey={defaultTabsKey} tabPosition='top' onChange={onTabChange}>
      { generatorIconTabPane(dataArr) }
    </Tabs>;
  };

  const changeIconType = ({ target }: any) => {
    setCheckedValue(target.value)
    setDefaultTabsKey(IconModule.iconTypeClassify[target.value][0].value)
    generatorIconTabs(target.value);
  };

  // 生成3个单选按钮组
  const generatorType = (): ReactNodeArray => {
    const eleArr: ReactNodeArray = [];
    IconModule.iconType.forEach((item: any, index: number) => {
      eleArr.push(
        <Radio.Button key={index} value={item.value}>
          {item.icon}
          <span>{item.label}</span>
        </Radio.Button>
      );
    });
    return eleArr;
  };


  return (
    <Modal
      title={titleText || '图标库'}
      visible={showModal}
      width={modalWidth || '600'}
      footer={footer || null}
      maskClosable={maskClosable}
      bodyStyle={cssStyle || undefined}
      onCancel={onCloseModal}
      onOk={onOkModal}
    >
      <div>
        <Radio.Group
          onChange={changeIconType}
          defaultValue="Outlined"
          value={checkedValue}
          buttonStyle="solid"
        >
          {generatorType()}
        </Radio.Group>
      </div>
      <div className={styles.iconTabsDiv}>
        {generatorIconTabs(checkedValue)}
      </div>
    </Modal>
  );
};
export default IconModal;
