// 表单校验信息统一返回
const ValidateMessages = {
  required: '[${label}] 不能为空!',
  max: '[${label}]最大只能输入 ${max} 字',
  types: {
    email: '[${label}]邮箱格式不合法',
    number: '[${label}]只能填写数字!',
  },
  number: {
    range: '$[{label}] 必须处于 ${min} - ${max} 之间',
  },
};
export default ValidateMessages;
