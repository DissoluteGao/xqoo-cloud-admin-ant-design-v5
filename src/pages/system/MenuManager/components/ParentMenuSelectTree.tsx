import {SimpleMenuInfo} from "@/pages/system/MenuManager/data";
import React, {useEffect, useState} from "react";
import {message, TreeSelect} from "antd";
import {ResponseData} from "@/services/PublicInterface";
import {getSimpleMenuInfo} from "@/pages/system/MenuManager/service";

export interface ParentMenuSelectTreeProps {
  menuInfoArr?: SimpleMenuInfo[];
  onChange: (value: any) => void;
  initValue: number | string[] | number[];
  disabledForm: boolean;
  nowValue?: number | string[] | number[];
  canCheckable: boolean;
  canCheckedStrategy?: any;
  widthStr?: string;
  loading: boolean;
}

const ParentMenuSelectTree: React.FC<ParentMenuSelectTreeProps> = (props) => {
  const { menuInfoArr, initValue, disabledForm, nowValue, onChange, canCheckable, canCheckedStrategy, widthStr,loading } = props
  const [menuTreeData, setMenuTreeData] = useState<SimpleMenuInfo[]>([{key: 0,title: '顶级目录', value: 0}]);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  // 获取简要菜单信息
  const selfGetSimpleMenuInfo = async (): Promise<SimpleMenuInfo[]> => {
    setLocalLoading(true);
    const data: ResponseData<SimpleMenuInfo[]> = await getSimpleMenuInfo();
    if (data.code === 200 && data.data) {
      return data.data;
    }
    message.error({ content: `获取菜单信息出错:${data.message}`, key: 'MenuMangerError'});
    return [];
  };

  useEffect(() => {
    if(menuInfoArr){
      if(menuInfoArr && menuInfoArr.length > 0){
        setMenuTreeData(menuInfoArr);
      }
    }else{
      selfGetSimpleMenuInfo().then(res => {
        setLocalLoading(false);
        setMenuTreeData(res);
      }).catch(e => {
        message.error('查询菜单信息出错', e)
        setMenuTreeData([]);
        setLocalLoading(false);
      })
    }
  }, [menuInfoArr]);
  return (
        <TreeSelect
          showSearch
          loading={loading || localLoading}
          style={{ width: widthStr || '60%' }}
          disabled={disabledForm}
          defaultValue={initValue}
          treeCheckable={canCheckable}
          value={nowValue}
          showCheckedStrategy={canCheckedStrategy || TreeSelect.SHOW_CHILD}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={menuTreeData}
          placeholder="请选择父级菜单"
          treeDefaultExpandAll
          onChange={(value) => {
            onChange(value)
          }}
        />
  );
}
export default ParentMenuSelectTree;
