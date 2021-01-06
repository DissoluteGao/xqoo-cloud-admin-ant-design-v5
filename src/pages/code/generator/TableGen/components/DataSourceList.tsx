import React, {useEffect, useState} from "react";
import {useModel} from "@@/plugin-model/useModel";
import {Button, Card, Col, Pagination, Result, Row} from "antd";
import {DataSourceInfo, QueryDataSourceInfo} from "@/pages/code/DataSource/data";
import ProSkeleton from "@ant-design/pro-skeleton";
import {history} from 'umi';
import styles from "../index.less";

export interface DataSourceListProps {
  onCheckResourceId: (id: number) => void;
}

const DataSourceList: React.FC<DataSourceListProps> = (props: DataSourceListProps) => {
  const {onCheckResourceId} = props;
  const { dataSourceList, totalElements,
    loading, hasError, errorMessage, getDataSourceFromServer} = useModel('code.DataSource.DataSourceInfoModel');
  const [dataSourceLocalListData, setDataSourceLocalListData] = useState<DataSourceInfo[]>([]);
  const [dataSourceItemList, setDataSourceItemList] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<QueryDataSourceInfo>({page: 1, pageSize: 20});

  useEffect(() => {
    getDataSourceFromServer({page: 1, pageSize: 20});
  }, []);

  useEffect(() => {
    if(dataSourceList.length > 0){
      checkItem(0, false);
    }
  }, [dataSourceList]);

  useEffect(() => {
    if(dataSourceLocalListData.length > 0){
      initDataSourceItem();
    }
  }, [dataSourceLocalListData]);

  // 点击卡片执行的逻辑
  const checkItem = (checkedId: number, click: boolean) => {
    if(click){
      return;
    }
    const tmpArr: DataSourceInfo[] = [];
    dataSourceList.forEach(item => {
      if(item.id === checkedId){
        item.checked = true
        onCheckResourceId(item.id);
      }else{
        item.checked = false
      }
      tmpArr.push(item);
    });
    setDataSourceLocalListData(tmpArr);
  };

  const initDataSourceItem = () => {
    const arr: any[] = [];
    dataSourceLocalListData.forEach(item => {
      arr.push(generatorItem(item))
    });
    setDataSourceItemList(arr);
  };

  const generatorItem = (itemData: DataSourceInfo) => {
    return <li key={itemData.id} onClick={() => { checkItem(itemData.id, itemData.checked)}}>
      <Card
        key={itemData.id}
        bodyStyle={itemData.checked ? {padding: '15px'} : {padding: '5px'}}
        hoverable={!itemData.checked}
        className={itemData.checked ? styles.hoverOnLi : ''}
      >
        <Row>
          <Col span={12}>
            {itemData.dataBaseHost}
          </Col>
          <Col span={12}>
            {itemData.dataBaseShowName}
          </Col>
        </Row>
      </Card>
    </li>
  };

  const handleDataSourcePageChange = (page: number, pageSize?: number) => {
    const pageNowInfo = {
      page,
      pageSize: pageSize || pageInfo.pageSize
    };
    setPageInfo(pageNowInfo);
    getDataSourceFromServer(pageNowInfo);
  };

  return (
    <div>
      <div>
        {
          hasError ? null :
            <div style={{padding: '2px', textAlign: 'left'}}>
              <Row>
                <Col md={4} xs={24}>
                  选择数据源
                </Col>
                <Col md={16} xs={24}>
                  {
                    totalElements > pageInfo.pageSize ?
                      <Pagination
                        size="small"
                        total={totalElements}
                        current={pageInfo.page}
                        pageSize={pageInfo.pageSize}
                        showSizeChanger={false}
                        onChange={handleDataSourcePageChange}
                      />
                      :
                      null
                  }
                </Col>
                <Col md={4} xs={24}>
                  { totalElements > 0 ?
                  `共计${totalElements}条`
                    :null
                  }
                </Col>
              </Row>

            </div>
        }
      </div>
      <div className={[`${styles.listDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')} >
        {
          loading ? <ProSkeleton active type='result' />
            : hasError ? <Result
              status="error"
              title={errorMessage}
            />
            :
            dataSourceItemList.length > 0 ?
              <ul>
                { dataSourceItemList }
              </ul>
              :
              <Result
                key='noDataSourceResult'
                status="info"
                title="无数据"
                subTitle="暂无数据"
                extra={<Button
                  type="primary"
                  danger
                  onClick={() => history.push("/code/DataSource")}
                >新增数据源</Button>}
              />
        }
      </div>
    </div>
  );
};

export default DataSourceList;
