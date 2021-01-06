import React, {Component} from 'react';
import {history} from 'umi';
import {AppstoreAddOutlined, RollbackOutlined, SyncOutlined} from '@ant-design/icons';
import { Button, Col, Divider, message, Result, Row, Skeleton, Space, Spin} from 'antd';
import MenuItemComponents from '@/pages/system/MenuManager/components/MenuItemComponents';
import {MenuDetailInfo, SimpleMenuInfo} from '@/pages/system/MenuManager/data';
import {getMenuDetailInfo, getSimpleMenuInfo} from '@/pages/system/MenuManager/service';
import QueryNoData from '@/components/QueryNoData';
import {MenuManagerShowEnum} from "@/pages/system/MenuManager/enums";
import MenuDetailInfoForm from "@/pages/system/MenuManager/components/MenuDetailInfoForm";
import {ResponseData} from "@/services/PublicInterface";
import styles from './MenuManager.less';

export interface MenuMangerProps {}

interface MenuMangerState {
  loadingMenuList: boolean;
  simpleMenuInfoArr?: SimpleMenuInfo[];
  queryError: boolean;
  checkedMenuId: string;
  lastCheckMenuId?: string;
  nowMenuDetailInfo?: MenuDetailInfo;
  menuDetailInfoShowStatus: MenuManagerShowEnum;
  reloadDetailInfo: boolean;
  menuDetailInfoTipsMessage?: string;
  detailTipsShow: boolean,
  detailTipsTitle?: string,
  detailTipsContent?: string,
  detailTipsType?: 'success' | 'info' | 'warning' | 'error',
  selectMenuKeys: string[],
}

class MenuManager extends Component<MenuMangerProps, MenuMangerState> {
  state: MenuMangerState = {
    loadingMenuList: true,
    simpleMenuInfoArr: [],
    queryError: false,
    checkedMenuId: '0',
    lastCheckMenuId: undefined,
    nowMenuDetailInfo: undefined,
    menuDetailInfoShowStatus: MenuManagerShowEnum.INIT,
    reloadDetailInfo: false,
    menuDetailInfoTipsMessage: '获取明细信息出错',
    detailTipsShow: false,
    detailTipsType: 'info',
    selectMenuKeys: [],
  };

  async componentDidMount() {
    await this.simpleMenuInfo();
  }

  componentWillUnmount(): void {
    this.setState = () =>{
    };
  };


  // 渲染菜单
  menuRender = (menuArr: SimpleMenuInfo[]) => (
    <MenuItemComponents
      menuArr={menuArr}
      defaultSelectedKeys={this.state.selectMenuKeys}
      checkedMenuId={this.getCheckedMenuId}
    />
  );
  // 无数据渲染

  noData = (isError?: boolean, textContent?: string) => (
    <QueryNoData isError={isError} textContent={textContent} />
  );

  // 通用返回界面
  renderDetailRight = (title: string, content: string | undefined, type: 'success' | 'error' | 'info' | 'warning' | 404 | 403 | 500, error: boolean) => {
    return <div className={styles.detailDiv}>
      <Result
        status={type}
        title={title}
        subTitle={content}
        extra={
          !error ?
            <span className={styles.logo} onClick={() => {
              this.setState({
                menuDetailInfoShowStatus: MenuManagerShowEnum.PREPARE,
                selectMenuKeys: [],
                nowMenuDetailInfo: undefined,
              })
            }}>
            <AppstoreAddOutlined />
          </span>
            : null
        }
      />
    </div>
  };

  // 获取子组件传递的菜单id
  getCheckedMenuId = (val: string) => {
    this.setState(
      {
        checkedMenuId: val,
        selectMenuKeys: [val],
      },
      () => {
        this.menuDetailInfo(this.state.checkedMenuId).then().catch(e => {
          console.error('获取菜单明细信息出错', e)
        });
      },
    );
  };

  // 查询路由概要信息
  simpleMenuInfo = async (): Promise<void> => {
    let simpleMenuInfoArr: SimpleMenuInfo[];
    this.setState({
      loadingMenuList: true,
    });
    const data: ResponseData<SimpleMenuInfo[]> = await getSimpleMenuInfo();
    this.setState({
      loadingMenuList: false,
    });
    if (data.code === 200 && data.data) {
      simpleMenuInfoArr = data.data;
      this.setState({
        simpleMenuInfoArr,
        queryError: false,
      });
    }else{
      message.error({ content: `获取菜单信息出错:${data.message}`, key: 'MenuMangerError'});
      simpleMenuInfoArr = [];
      this.setState({
        simpleMenuInfoArr,
        queryError: true,
      });
    }
  };

  // 查询路由详细信息
  menuDetailInfo = async (menuId: string): Promise<void> => {
    if(menuId === this.state.lastCheckMenuId){
      return;
    }
    this.setState({
      menuDetailInfoShowStatus: MenuManagerShowEnum.LOADING
    })
    const menuInfo = await getMenuDetailInfo(menuId);
    if(menuInfo.code !== 200){
      this.setState({
        menuDetailInfoTipsMessage: menuInfo.message,
        menuDetailInfoShowStatus: MenuManagerShowEnum.ERROR
      })
    }else{
      if(!menuInfo.data?.id){
        this.setState({
          menuDetailInfoTipsMessage: '没有此项菜单相关数据，请重新查询',
          menuDetailInfoShowStatus: MenuManagerShowEnum.NO_DATA
        })
      }
      this.setState({
        lastCheckMenuId: menuId,
        nowMenuDetailInfo: menuInfo.data,
        menuDetailInfoShowStatus: MenuManagerShowEnum.SUCCESS
      })
    }
  }

  // 根据条件渲染表单页面
  renderDetailInfoForm = () => {
    // 载入中
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.LOADING){
      return <div style={{ padding: '30px'}}>
        <Space direction="vertical">
          <Space>
            <Skeleton.Button active size="large" shape="round" />
            <Skeleton.Input active size="large" style={{ width: 400 }} />
          </Space>
          <br />
          <Space>
            <Skeleton.Button active size="large" shape="round" />
            <Skeleton.Input active size="large" style={{ width: 210 }} />
          </Space>
          <br />
          <Space>
            <Skeleton.Button active size="large" shape="round" />
            <Skeleton.Input active size="large" style={{ width: 100 }} />
            <Skeleton.Button active size="large" shape="round" />
            <Skeleton.Input active size="large" style={{ width: 80 }} />
          </Space>
          <br />
          <Space>
            <Skeleton.Button active size="large" shape="round" />
            <Skeleton.Input active size="large" style={{ width: 140 }} />
          </Space>
          <br />
          <Space>
            <Skeleton.Button active size="large" shape="round" />
            <Skeleton.Input active size="large" style={{ width: 80 }} />
          </Space>
          <br />
          <Space>
            <Skeleton.Button active size="large" shape="round" />
            <Skeleton.Input active size="large" style={{ width: 350 }} />
          </Space>
          <br />
        </Space>
      </div>
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.PREPARE){
      return <MenuDetailInfoForm
        key='noDataForm'
        addedMenu={this.hadAddMenu}
        updatedMenu={this.hadUpdatedMenu}
        removedMenu={this.hadRemoveMenu}
        reloadMenu={this.reloadingMenu}
        menuDetailInfo={undefined}
        simpleMenuInfo={this.state.simpleMenuInfoArr}
        tipsShow={this.state.detailTipsShow}
        tipsTitle={this.state.detailTipsTitle}
        tipsContent={this.state.detailTipsContent}
      />
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.SUCCESS){
      return <MenuDetailInfoForm
        key='detailDataForm'
        addedMenu={this.hadAddMenu}
        updatedMenu={this.hadUpdatedMenu}
        removedMenu={this.hadRemoveMenu}
        reloadMenu={this.reloadingMenu}
        menuDetailInfo={this.state.nowMenuDetailInfo}
        simpleMenuInfo={this.state.simpleMenuInfoArr}
        tipsShow={this.state.detailTipsShow}
        tipsTitle={this.state.detailTipsTitle}
        tipsContent={this.state.detailTipsContent}
      />
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.NO_DATA){
      return this.renderDetailRight('警告', '未找到对应数据', 'warning', false);
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.ERROR){
      return this.renderDetailRight('发生错误', this.state.menuDetailInfoTipsMessage, 'error', false);
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.DELETED){
      return this.renderDetailRight('删除成功', this.state.menuDetailInfoTipsMessage, 'success', false);
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.ADDED){
      return this.renderDetailRight('添加成功', this.state.menuDetailInfoTipsMessage, 'success', false);
    }
    // 默认界面
    return this.renderDetailRight('提示信息', '请点击左侧菜单栏载入数据或点击下方按钮添加新的菜单', 'info', false);
  }

  renderRightTitle = () => {
    if(this.state.reloadDetailInfo){
      return <span className={styles.rightTitle}>保存更新...</span>;
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.LOADING){
      return <span className={styles.rightTitle}>正在加载...</span>;
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.PREPARE){
      return <span className={styles.rightTitle}>新增菜单</span>;
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.INIT){
      return <span className={styles.rightTitle}>请先选择</span>;
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.SUCCESS){
      return <span className={styles.rightTitle}>{this.state.nowMenuDetailInfo?.name}</span>;
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.DELETED){
      return <span className={styles.rightTitle}>删除完成</span>;
    }
    if(this.state.menuDetailInfoShowStatus === MenuManagerShowEnum.ADDED){
      return <span className={styles.rightTitle}>新增完成</span>;
    }
    return <span className={styles.rightTitle}>无法查看</span>;

  };

  // 启动明细载入画面
  reloadingMenu = (value: boolean) => {
    this.setState({
      reloadDetailInfo: value
    });
  };

  // 处理删除完成后的逻辑
  hadRemoveMenu = (value: number | undefined) => {
    if(value){
      this.simpleMenuInfo().then(() => {
        this.setState({
          menuDetailInfoShowStatus: MenuManagerShowEnum.DELETED,
          menuDetailInfoTipsMessage: '删除成功，请点击下方按钮添加新的菜单',
          reloadDetailInfo: false,
        })
      })
    }
  };

  // 处理新增完成后的逻辑
  hadAddMenu = () => {
    this.simpleMenuInfo().then(() => {
      this.setState({
        reloadDetailInfo: false,
        menuDetailInfoShowStatus: MenuManagerShowEnum.ADDED,
        menuDetailInfoTipsMessage: '添加成功，请到右侧菜单中查看,或者点击下方新增按钮继续添加'
      })
    })
  };

  // 处理更新完成后的逻辑
  hadUpdatedMenu = (menuDetailInfo: MenuDetailInfo) => {
    this.simpleMenuInfo().then( async () => {
      message.success('保存成功,数据若有偏差请重新查询');
      this.setState({
        nowMenuDetailInfo: menuDetailInfo,
        reloadDetailInfo: false,
        selectMenuKeys: [String(menuDetailInfo?.id)] || [],
      })
    });
  };

  render() {
    const { loadingMenuList, simpleMenuInfoArr, queryError, reloadDetailInfo, menuDetailInfoShowStatus } = this.state;

    const queryDataSuccess = () => {
      if (simpleMenuInfoArr && simpleMenuInfoArr.length > 0) {
        return this.menuRender(simpleMenuInfoArr);
      }
      return this.noData(queryError, queryError ? '查询数据出错' : '没有菜单数据');
    };

    return (
      <Row gutter={[0, 40]}>
        <Col span={24} className={styles.mainDiv}>
          <Button type="link" icon={<RollbackOutlined />} onClick={() => {
            history.push('/');
          }}>
            返回首页
          </Button>
          <div className={styles.title}>菜单信息维护</div>
        </Col>
        <Col span={24}>
          <Row align="top">
            <Col md={6} xs={24} className={styles.menuSpan}>
              <Button
                type="link"
                icon={<SyncOutlined />}
                loading={loadingMenuList}
                onClick={async () => {
                  await this.simpleMenuInfo();
                }}
              >
                刷新
              </Button>
              <Divider orientation="left" plain>
                菜单列表
              </Divider>
              <Spin tip="正在加载菜单..." spinning={loadingMenuList}>
                <div className={styles.menuDiv}>{queryDataSuccess()}</div>
              </Spin>
            </Col>
            <Col md={{ span: 17, offset: 1 }} xs={{ span: 24, offset: 0 }} className={styles.detailSpan}>
              {
                menuDetailInfoShowStatus === MenuManagerShowEnum.SUCCESS
                  || menuDetailInfoShowStatus === MenuManagerShowEnum.ERROR || menuDetailInfoShowStatus === MenuManagerShowEnum.NO_DATA ?
                <div><Button type='link' icon={<AppstoreAddOutlined />} onClick={() => {
                  this.setState({
                    menuDetailInfoShowStatus: MenuManagerShowEnum.PREPARE,
                    selectMenuKeys: [],
                    nowMenuDetailInfo: undefined,
                  })
                }}>添加新菜单</Button></div> : null
              }
              <Divider orientation="left" plain>
                {this.renderRightTitle()}
              </Divider>
              <Spin tip="加载中..." size="large" spinning={reloadDetailInfo}>
                {
                  this.renderDetailInfoForm()
                }
              </Spin>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
export default MenuManager;
