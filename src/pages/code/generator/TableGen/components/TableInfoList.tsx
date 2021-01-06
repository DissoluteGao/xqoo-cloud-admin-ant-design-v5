import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {TableEntity} from "@/pages/code/generator/data";
import {Button, Card, Col, Result, Row, Spin, Tooltip} from "antd";
import Settings from "../../../../../../config/defaultSettings";
import {SyncOutlined} from "@ant-design/icons";
import styles from '../index.less';


export interface TableInfoListProps {
  dataSourceId: number;
  onCheckTableName: (tableName: string) => void;
  onCheckTableItem: (table: TableEntity) => void;
}

const TableInfoList: React.FC<TableInfoListProps> = (props: TableInfoListProps) => {
  const {dataSourceId, onCheckTableName, onCheckTableItem} = props;
  const {loading, hasError, errorMessage, tableInfoList, getTableInfoFromServer, removeCacheTablesFromServer} = useModel('code.generator.TableQueryModel');
  const [localTableInfoList, setLocalTableInfoList] = useState<TableEntity[]>([]);
  const [tableItemList, setTableItemList] = useState<any[]>([]);

  useEffect(() => {
    if(dataSourceId && dataSourceId > 0){
      getTableInfoFromServer(dataSourceId);
    }else{
      setTableItemList([]);
      setLocalTableInfoList([]);
    }
  }, [dataSourceId]);

  useEffect(() => {
    if(tableInfoList.length > 0 && dataSourceId > 0){
      checkTableItem('none-table-9x9', false)
    }
  }, [tableInfoList]);

  useEffect(() => {
    if(localTableInfoList.length > 0){
      initTableItem();
    }
  }, [localTableInfoList]);

  // 点击卡片执行的逻辑
  const checkTableItem = (checkedTable: string, click: boolean) => {
    if(click){
      return;
    }
    const tmpArr: TableEntity[] = [];
    tableInfoList.forEach((item: TableEntity) => {
      if(item.tableName === checkedTable){
        item.checked = true;
        onCheckTableName(item.tableName);
        onCheckTableItem(item);
      }else{
        item.checked = false
      }
      tmpArr.push(item);
    });
    setLocalTableInfoList(tmpArr);
  };

  const initTableItem = () => {
    const arr: any[] = [];
    localTableInfoList.forEach(item => {
      arr.push(generatorItem(item))
    });
    setTableItemList(arr);
  };

  const generatorItem = (itemData: TableEntity) => {
    return <li key={itemData.tableName} onClick={() => { checkTableItem(itemData.tableName, itemData.checked)}}>
      <Card
        key={itemData.tableName}
        bodyStyle={itemData.checked ? {padding: '15px'} : {padding: '5px'}}
        hoverable={!itemData.checked}
        className={itemData.checked ? styles.hoverOnLi : ''}
      >
        <Row>
          <Col span={12}>
            {itemData.schemeName}
          </Col>
          <Col span={12}>
            {itemData.tableName}
          </Col>
          <Col span={24}>
            <div className={styles.ellipsis}>
              <Tooltip overlay={undefined} title={itemData.comment} color={Settings.primaryColor} key={Settings.primaryColor}>
                {itemData.comment}
              </Tooltip>
            </div>
          </Col>
        </Row>
      </Card>
    </li>
  };

  const refreshCache = () => {
    if(dataSourceId > 0){
      removeCacheTablesFromServer(dataSourceId);
    }
  };

  return (
    <div>
      <div>
        {
          hasError ? null :
            <div style={{padding: '2px', textAlign: 'left'}}>
              <Row>
                <Col md={12} xs={24}>
                  {
                    tableItemList.length > 0 ?
                      "请选择数据表"
                      :
                      "请先点击左侧选择一个数据源"
                  }
                </Col>
                <Col md={2} xs={0} />
                <Col md={6} xs={6}>
                  {
                    dataSourceId && dataSourceId > 0 ?
                      <Button
                        type="link"
                        icon={<SyncOutlined />}
                        loading={loading}
                        size='small'
                        onClick={refreshCache}
                      >
                        刷新缓存
                      </Button>
                      :
                      null
                  }
                </Col>
                <Col md={4} xs={18}>
                  {
                    tableItemList.length > 0 ?
                      `共计${tableItemList.length}条`
                      :
                      null
                  }

                </Col>
              </Row>

            </div>
        }
      </div>
      <div className={[`${styles.listDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')} >
        <Spin spinning={loading} tip="正在加载...">
          {
            hasError ?
              <Result
                status="error"
                title={errorMessage}
              />
              :
              tableItemList.length > 0 ?
                <ul>
                  { tableItemList }
                </ul>
                :
                <Result
                  key='noTableResult'
                  status="info"
                  title="无数据"
                  subTitle="暂无数据"
                />
          }
        </Spin>
      </div>
    </div>
  );
};
export default TableInfoList;
