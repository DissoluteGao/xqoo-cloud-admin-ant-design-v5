import {RoleDetailInfo} from "@/pages/system/RoleManager/data";

class FormRoleDetailInfo{
  roleDetail: RoleDetailInfo | undefined;

  constructor (roleDetail: RoleDetailInfo | undefined) {
    if(!roleDetail) {
      this.roleDetail = {
        id: undefined,
        admin: false,
        delFlag: false,
        roleKey: undefined,
        roleName: undefined,
        createBy: '',
        createDate: '',
        updateBy: '',
        updateDate: '',
        roleApiList: [],
        roleMenuList: [],
        remarkTips: '',
      };
    }else{
      this.roleDetail = Object.assign(roleDetail);
    }
  }

  formRoleDetailInfo() {
    return this.roleDetail;
  }
}

export default FormRoleDetailInfo;
