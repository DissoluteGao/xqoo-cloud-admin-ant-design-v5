import {MenuHeaderTheme, MenuLayOutEnum} from "@/pages/system/MenuManager/enums";
import {MenuDetailFormInfo, MenuDetailInfo} from "@/pages/system/MenuManager/data";
import {randomString} from "@/utils/utils";

class FormMenuDetailInfo{
  menuDetail: MenuDetailFormInfo | undefined;

  constructor (menuInfo: MenuDetailInfo | undefined) {
    if(!menuInfo) {
      this.menuDetail = {
        hasChild: false,
        path: "default" + randomString(6, undefined),
        parentId: 0,
        parentPath: '/',
        sortNo: 1,
        icon: 'SmileOutlined',
        outSideJump: false,
        hideInMenu: false,
        layout: MenuLayOutEnum.MIX,
        menuRender: true,
        fixSiderbar: true,
        headerRender: true,
        fixedHeader: true,
        footerRender: false,
        navTheme: MenuHeaderTheme.LIGHT,
        headerTheme: MenuHeaderTheme.DARK,
      };
    }else{
      this.menuDetail = Object.assign(menuInfo);
    }
  }

  formMenuDetailInfo() {
    return this.menuDetail;
  }
}

export default FormMenuDetailInfo;
