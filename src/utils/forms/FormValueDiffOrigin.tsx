import {forIn as _forIn, isEqualWith as _isEqualWith} from "lodash";

// 表单字段变动
const FormValueDiffOrigin = (changedValues: any, allValues: any, T: any): boolean => {
  return _isEqualWith(T, allValues, () => {
    let same: boolean = true
    _forIn(allValues, (value, key) => {
      if(String(T[key]) !== String(value)){
        same = false
        return false;
      }
      return true
    });
    return same
  });
};
export default FormValueDiffOrigin;
