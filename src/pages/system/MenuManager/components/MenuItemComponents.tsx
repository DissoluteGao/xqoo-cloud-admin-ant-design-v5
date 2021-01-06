import React, { Component } from 'react';
import { Button, Menu, Tooltip } from 'antd';
import { SimpleMenuInfo } from '@/pages/system/MenuManager/data';
import { CustomIconMap } from '@/maps/IconMaps/CustomIconMap';
import { QuestionCircleOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import defaultSettings from '@ant-design/pro-layout/lib/defaultSettings';

const { SubMenu } = Menu;

export interface MenuItemComponentsProps {
  menuArr: SimpleMenuInfo[];
  checkedMenuId: (id: string, name: string) => void;
  defaultSelectedKeys: string[];
}

interface MenuItemComponentsState {
  defaultOpenKeys: string[];
  initFinish: boolean;
  nowSelectKey: string[],
}

class MenuItemComponents extends Component<MenuItemComponentsProps, MenuItemComponentsState> {
  static defaultProps = {
    menuArr: [],
  };

  static getDerivedStateFromProps (nextProps: any, prevState: any) {
    return {
      nowSelectKey: nextProps.defaultSelectedKeys
    }
  }

  constructor(props: MenuItemComponentsProps) {
    super(props);
    this.state = {
      defaultOpenKeys: [],
      initFinish: false,
      nowSelectKey: this.props.defaultSelectedKeys || [],
    };
  };

  componentDidMount(): void {
    // const defaultSelected = this.initDefaultSelected(this.props.menuArr[0]);
    const defaultOpen = this.initDefaultOpen([], this.props.menuArr);
    this.setState(
      {
        defaultOpenKeys: defaultOpen,

        initFinish: true,
      });
  };

  // 初始化默认选中
  initDefaultSelected = (menuArr: SimpleMenuInfo): string[] => {
    const arr = [];
    if (menuArr.children) {
      return this.initDefaultSelected(menuArr.children[0]);
    }
    arr.push(String(menuArr.key));
    return arr;
  };

  // 初始化默认展开
  initDefaultOpen = (openArr: string[], menuArr: SimpleMenuInfo[]): string[] => {
    menuArr.forEach((item) => {
      if (item.children) {
        openArr.push(String(item.key));
        openArr.concat(this.initDefaultOpen(openArr, item.children));
      }
    });
    return openArr;
  };

  // 通知父级选中的id
  sendCheckedMenuId = (id: string, name?: string) => {
    this.props.checkedMenuId(id, name ? name : '首页');
  };

  // 递归渲染菜单
  generatorMenu = (arr: SimpleMenuInfo[]) => {
    return arr.map((item) => {
      if (item.children) {
        return (
          <SubMenu
            key={String(item.key)}
            icon={CustomIconMap[item.icon as string]}
            title={
              <Tooltip
                placement="right"
                title="点此编辑非页面菜单"
                color={defaultSettings.primaryColor}
                key={defaultSettings.primaryColor}
              >
                <Button
                  type="link"
                  onClick={() => {
                    this.props.checkedMenuId(String(item.key), String(item.name));
                  }}
                >
                  { item.hideInMenu ? <span style={{ color: '#cbcbcb',fontSize: '2px'}}><EyeInvisibleOutlined />(已隐藏)</span> : null}
                  <QuestionCircleOutlined />
                  {item.name}
                </Button>
              </Tooltip>
            }
          >
            {this.generatorMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={String(item.key)} icon={CustomIconMap[item.icon as string]}>
          { item.hideInMenu ? <span style={{ color: '#cbcbcb',fontSize: '2px'}}><EyeInvisibleOutlined />(已隐藏)</span> : null}
          {item.name}
        </Menu.Item>
      );
    });
  };

  render() {
    const { menuArr, defaultSelectedKeys } = this.props;
    const { defaultOpenKeys, initFinish, nowSelectKey } = this.state;

    const handleClick = (e: any) => {
      this.setState({
        nowSelectKey: [e.key]
      })
      this.sendCheckedMenuId(e.key, '正在加载...');
    };

    return initFinish ? (
      <Menu
        onClick={handleClick}
        style={{ width: '100%' }}
        defaultSelectedKeys={defaultSelectedKeys}
        selectedKeys={nowSelectKey}
        defaultOpenKeys={defaultOpenKeys}
        theme="dark"
        mode="inline"
      >
        {this.generatorMenu(menuArr)}
      </Menu>
    ) : (
      <></>
    );
  }
}

export default MenuItemComponents;
