import {MenuDataItem} from "@ant-design/pro-layout/lib/typings";
export default function access(initialState: { currentUser?: API.CurrentUser | undefined, menuData: MenuDataItem[]}) {
  const { currentUser, menuData } = initialState || {};
  return {
    routeFilter: (route: { path: string | undefined; }) => {
      if(currentUser?.admin){
        return true;
      }
      return menuData.some(function iter (item) {
        if(item.path === route.path){
          return true;
        }
        return Array.isArray(item.children) && item.children.some(iter);
      })
    },
  };
}
