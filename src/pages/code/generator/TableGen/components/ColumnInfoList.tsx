import {ColumnEntity} from "@/pages/code/generator/data";
import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, Col, Result, Row, Spin, Tooltip} from "antd";
import Settings from "../../../../../../config/defaultSettings";
import {CheckSquareFilled, SyncOutlined, KeyOutlined} from "@ant-design/icons";
import {filter as _filter, find as _find} from "lodash";
import styles from "../index.less";

export interface ColumnInfoListProps {
  tableName: string|undefined;
  dataSourceId: number;
  onCheckedColumnInfo: (column: ColumnEntity[]) => void;
}

const ColumnInfoList: React.FC<ColumnInfoListProps> = (props: ColumnInfoListProps) => {
  const {tableName, dataSourceId, onCheckedColumnInfo} = props;
  const {loading, hasError, errorMessage, columnInfoList, getColumnInfoFromServer, removeCacheColumnsFromServer} = useModel('code.generator.ColumnsQueryModel');
  const [localColumnInfoList, setLocalColumnInfoList] = useState<ColumnEntity[]>([]);
  const [columnItemList, setColumnItemList] = useState<any[]>([]);
  const [checkedAddAll, setCheckedNameAll] = useState<boolean>(false);
  const [indeterminateAdd, setIndeterminateAdd] = useState<boolean>(true);
  const [checkedNameList, setCheckedNameList] = useState<string[]>([]);

  useEffect(() => {
    if(checkedNameList.length > 0){
      setIndeterminateAdd(true);
      setCheckedNameAll(false);
    }
    if(checkedNameList.length === localColumnInfoList.length){
      setIndeterminateAdd(false);
      setCheckedNameAll(true);
    }
    if(checkedNameList.length < 1){
      setIndeterminateAdd(false);
      setCheckedNameAll(false);
    }
    const tmpArr: ColumnEntity[] = [];
    checkedNameList.forEach(nameItem => {
      const obj = _find(localColumnInfoList, (dataItem) => {return dataItem.columnName === nameItem });
      if(obj){
        tmpArr.push(obj);
      }
    });
    onCheckedColumnInfo(tmpArr);
  }, [checkedNameList]);

  useEffect(() => {
    if(dataSourceId && dataSourceId > 0 && tableName){
      getColumnInfoFromServer(dataSourceId, tableName);
    }else{
      setColumnItemList([]);
      setLocalColumnInfoList([]);
    }
  }, [dataSourceId, tableName]);

  useEffect(() => {
    if(columnInfoList.length > 0 && dataSourceId && dataSourceId > 0 && tableName){
      const tmpArr: ColumnEntity[] = [];
      const checkedArr: string[] = [];
      columnInfoList.forEach(item => {
        tmpArr.push(item);
        checkedArr.push(item.columnName);
      });
      setCheckedNameList(checkedArr);
      setCheckedNameAll(true);
      setLocalColumnInfoList(tmpArr);
    }
  }, [columnInfoList]);

  useEffect(() => {
    if(localColumnInfoList.length > 0){
      initColumnItem();
    }
  }, [localColumnInfoList]);

  const initColumnItem = () =>{
    const arr: any[] = [];
    localColumnInfoList.forEach(item => {
      arr.push(generatorColumnItem(item));
    });
    setColumnItemList(arr);
  };

  // 点击卡片执行的逻辑
  const checkNowLiItem = (checkedName: string, clickCheck: boolean) => {
    handleRenderCheckLi(!clickCheck, checkedName);
    if(clickCheck){
      setCheckedNameList(_filter(checkedNameList, (item: string) => {return item !== checkedName}));
    }else{
      setCheckedNameList(checkedNameList.concat([checkedName]));
    }
  };

  const generatorColumnItem = (itemData: ColumnEntity) => {
    return <li key={itemData.columnName} onClick={() => {checkNowLiItem(itemData.columnName, itemData.checked)}}>
      <Card
        bodyStyle={itemData.checked ? {padding: '10px'} : {padding: '5px'}}
        hoverable={!itemData.checked}
        className={itemData.checked ? styles.hoverOnLi : ''}
      >
        <Row justify="space-around" align="middle">
          <Col span={12}>
            字段:<span style={{color: '#c10942'}}>{itemData.columnName}</span>
          </Col>
          <Col span={12}>
            类型:<span style={{color: '#c10942'}}>{itemData.columnsTypeName}</span>
          </Col>
          <Col span={24}>
            <div className={styles.ellipsis}>
              <Tooltip overlay={undefined} title={itemData.comment} color={Settings.primaryColor} key={Settings.primaryColor}>
                说明:<span style={{color: '#c10942'}}>{itemData.comment}</span>
              </Tooltip>
            </div>
          </Col>
        </Row>
        {
          itemData.primaryKey ?
            <div className={styles.primaryKeyDiv}>
              <Tooltip title="主键" overlay={undefined} color={Settings.primaryColor}>
                <KeyOutlined />
              </Tooltip>
            </div>
            :
            null
        }
        {
          itemData.checked ? <div className={styles.checkedDiv}>
              <Tooltip title="已选中" overlay={undefined} color={Settings.primaryColor}>
                <CheckSquareFilled />
              </Tooltip>
            </div>
            :
            null
        }
      </Card>
    </li>
  };

  // 更改渲染上的样式
  const handleRenderCheckLi = (changeToType: boolean, checkedColumnName?: string) => {
    const tmpArr: ColumnEntity[] = [];
    localColumnInfoList.forEach(item => {
      if(checkedColumnName && item.columnName === checkedColumnName){
        item.checked = changeToType;
      }
      if(!checkedColumnName){
        item.checked = changeToType;
      }
      tmpArr.push(item);
    });
    setLocalColumnInfoList(tmpArr);
  };

  // 添加字段全选，取消全选
  const onCheckNameAllChange = (e: any) => {
    if(e.target.checked){
      const arr: string[] = [];
      localColumnInfoList.forEach(item => {
        arr.push(item.columnName);
      });
      setCheckedNameList(arr);
      handleRenderCheckLi(true);
    }else{
      setCheckedNameList([]);
      handleRenderCheckLi(false);
    }
  };

  const refreshCache = () => {
    if(dataSourceId > 0 && tableName){
      removeCacheColumnsFromServer(dataSourceId, tableName);
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
                    columnItemList.length > 0 ?
                      <Checkbox
                        indeterminate={indeterminateAdd}
                        onChange={onCheckNameAllChange}
                        checked={checkedAddAll}
                      >
                        全选
                      </Checkbox>
                      : null
                  }
                </Col>
                <Col md={2} xs={0} />
                <Col md={6} xs={6}>
                  {
                    dataSourceId && dataSourceId > 0 && tableName ?
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
                    columnItemList.length > 0 ?
                      `共计${columnItemList.length}条`
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
              columnItemList.length > 0 ?
                <ul>
                  { columnItemList }
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

export default ColumnInfoList;
