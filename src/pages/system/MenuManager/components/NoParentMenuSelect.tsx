import {SimpleMenuInfo} from "@/pages/system/MenuManager/data";
import {Select} from "antd";
import React, {ReactNodeArray, useEffect, useState} from "react";

export interface NoParentMenuSelectProps {
  menuInfoArr?: SimpleMenuInfo[];
  onChange: (value: any) => void;
  initValue?: string | string[];
  disabledForm: boolean;
  widthStr?: string;
  loading: boolean;
  allowedClear?: boolean;
  model: 'multiple' | undefined;
  singleSearch?: boolean;
}

const NoParentMenuSelect: React.FC<NoParentMenuSelectProps> = (props) => {
  const { menuInfoArr, initValue, disabledForm, onChange, widthStr, loading, allowedClear, model, singleSearch } = props;
  const [optionArr, setOptionArr] = useState<any[]>([]);
  const [reRender, setReRender] = useState<boolean>(false);

  const initOptionValue = () => {
    if(menuInfoArr && menuInfoArr.length > 0){
      setOptionArr(menuInfoArr)
    }
    setReRender(true);
  };

  useEffect(() => {
    setReRender(false)
    initOptionValue()
  }, [menuInfoArr])


  const generatorOption = (): ReactNodeArray => {
    const eleArr: any = []
    optionArr.forEach((item: SimpleMenuInfo, index: number) => {
      eleArr.push(
        <Select.Option key={String(index) + String(item.key)} value={item.path || item.key}>
          {item.title}
        </Select.Option>
      )
    });
    return eleArr;
  };

  return (
    <div>
      {
        reRender ?
        <Select
          showSearch={singleSearch}
          loading={loading}
          mode={model}
          defaultValue={initValue}
          disabled={disabledForm}
          allowClear={allowedClear}
          style={{ width: widthStr }}
          placeholder="请选择系统中的一个路径作为重定向路径"
          optionFilterProp="children"
          onChange={onChange}
        >
          {
            generatorOption()
          }
        </Select>
          : null
      }
    </div>
  );
};

export default NoParentMenuSelect;
