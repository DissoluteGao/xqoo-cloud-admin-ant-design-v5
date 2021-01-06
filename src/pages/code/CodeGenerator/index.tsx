import React, {ReactNodeArray} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Col, Row, Tooltip} from "antd";
import {ToolOutlined} from "@ant-design/icons";
import { history } from 'umi';
import styles from "./index.less";

const generatorTypeArr = [
  {
    title: '生成单表实体',
    tips: '选择一张数据库表，生成相关的service、mapper等相关java文件',
    handlePath: '/code/codeGenerator/tableGen'
  },
  {
    title: '生成微服务',
    tips: '生成一个基础的微服务模块,包含基础的启动类和maven依赖，配置文件等',
    handlePath: '/code/codeGenerator/microServiceGen'
  },
  {
    title: '生成实体bean',
    tips: '生成一个包含getter,setter,toMap,fromMap的java实体bean',
    handlePath: '/code/codeGenerator/entityGen'
  }
];

const CodeGenerator: React.FC<{}> = () => {

  const generatorCardGrid = (): ReactNodeArray => {
    const arr: ReactNodeArray = [];
    generatorTypeArr.forEach(item => {
      arr.push(
        <Card.Grid key={item.handlePath} className={styles.cardGridStyle}>
          <Row>
            <Col span={24} className={styles.cardGridTitle}>
              <Tooltip overlay={undefined} title={item.title}>
                <span>{item.title}</span>
              </Tooltip>
            </Col>
            <Col span={24} className={styles.cardGridTips}>
              <Tooltip overlay={undefined} title={item.tips}>
                <span>{item.tips}</span>
              </Tooltip>
            </Col>
            <Col span={24} className={styles.cardGridTool}>
              <Button type="link" size='small' icon={<ToolOutlined />} onClick={() => {
                history.push(item.handlePath);
              }}>前往生成</Button>
            </Col>
          </Row>
        </Card.Grid>
      )
    })
    return arr;
  };

  return (
    <PageContainer fixedHeader>
      <Card title='生成代码种类' className={styles.cardStyle}>
        {
          generatorCardGrid()
        }
      </Card>
    </PageContainer>
  );
};

export default CodeGenerator;
