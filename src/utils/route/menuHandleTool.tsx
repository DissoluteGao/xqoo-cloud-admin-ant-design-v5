
import {CustomIconMap} from "@/maps/IconMaps/CustomIconMap";
import {MenuDataItem} from "@umijs/route-utils/dist/types";
import {SimpleMenuInfo} from "@/pages/system/MenuManager/data";

// 递归替换菜单中图标字符串为图标文件
export const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
  menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: icon && CustomIconMap[icon as string],
    children: children && loopMenuItem(children),
  }));

// 递归查找菜单符合的一想
export const loopFindMenuItem = async (id: number, arr: SimpleMenuInfo[]): Promise<SimpleMenuInfo | undefined> => {
  let obj: SimpleMenuInfo | undefined;
  arr.some(function iter (item) {
    if(item.value === id){
      obj = item;
      return true;
    }
    return Array.isArray(item.children) && item.children.some(iter);
  })
  return obj;
}
