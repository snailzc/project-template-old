import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tree, Modal, Button, message, Spin } from 'antd';
import DataTable from '../../../components/DataAuth';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EvpSearchForm from '../../../components/EvpSearchForm';
import { getConfigElement } from '../../../utils/utils';
import appConfig from '../../../../config/app.config';

import styles from './DataAuthManager.less';
// element config
let pageElement = {};
const { TreeNode } = Tree;

@connect(({ data, loading }) => ({
  data,
  landListLoading: loading.effects['data/fetchUser'],
  treeLoading: loading.effects['data/fetchType'],
}))
export default class EvpDataPage extends PureComponent {
  state = {
    page: 1,
    limit: 20,
    ifAll: 'init',
    searchTree: '',
    searchData: {
      username: '',
      dataId: '',
      appCode: '',
      beginDate: '',
      endDate: '',
      jobNo: '',
      accountType: '',
    },
    hasChoosed: [],
    modalVisible: false,
    controlCheck: false,
    autoExpandParent: false,
    selectRows: [],
    expandedKeys: [],
    curUser: '',
    allChoosed: [],
    allChoosedName: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'data/fetchUser',
      payload: {
        page: this.state.page,
        limit: this.state.limit,
        ...this.state.searchData,
        appCode: appConfig.appShortCode,
      },
    });
  }

  componentWillReceiveProps() {
    if (localStorage.ifDataManager === 'true') {
      const { dispatch } = this.props;
      dispatch({
        type: 'data/fetchUser',
        payload: {
          page: this.state.page,
          limit: this.state.limit,
          ...this.state.searchData,
          appCode: appConfig.appShortCode,
        },
      });
      localStorage.ifDataManager = 'false';
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys, e) => {
    const { data: { treeList } } = this.props;
    if (checkedKeys[0] === 'all') {
      this.setState({
        ifAll: 'true',
      });
    } else {
      this.setState({
        ifAll: 'false',
      });
    }
    const checkedNames = checkedKeys.map((item) => {
      const checkedName = treeList[0].children.find(el => el.regionNum === item);
      if (checkedName) {
        return checkedName.regionName;
      }
      return '牧原集团';
    });
    this.setState({
      controlCheck: true,
      hasChoosed: [...checkedKeys],
      allChoosed: [...checkedKeys, ...e.halfCheckedKeys],
      allChoosedName: [...checkedNames],
    });
  };

  selectList = (select) => {
    this.setState({
      selectRows: select,
    });
  };

  edit = (select) => {
    if (select) {
      // nothing to do
    } else if (!this.state.selectRows.length) {
      message.warning('请先选择一个用户');
      return false;
    } else if (this.state.selectRows.length > 1) {
      message.warning('只能选择一个用户');
      return false;
    }

    this.setState({
      controlCheck: false,
      ifAll: 'init',
    });

    const choosed = select ? select[0] : this.state.selectRows[0];
    const {
      data: { userList },
    } = this.props;

    userList.rows.map((item) => {
      if (item.id === choosed) {
        this.props.dispatch({
          type: 'data/fetchType',
          payload: {
            appCode: appConfig.appShortCode,
            userId: item.id,
          },
        });
        // this.props.dispatch({
        //   type: 'data/fetchUserPower',
        //   payload: {

        //     appCode: item.appCode,
        //   },
        // });
        this.setState({
          modalVisible: true,
          curUser: item.id,
        });
      }
      return '';
    });
  };

  handleStandardTableChange = (pagination, sorter) => {
    const { dispatch } = this.props;
    const params = {
      ...this.state.searchData,
      page: pagination.current,
      limit: pagination.pageSize,
      appCode: appConfig.appShortCode,
      orderColumn: sorter.field,
      order: sorter.order,
    };

    this.setState({
      page: pagination.current,
      limit: pagination.pageSize,
    });

    dispatch({
      type: 'data/fetchUser',
      payload: params,
    });
  };

  handleModalVisible = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleSearch = (val) => {
    this.setState({
      page: 1,
      limit: 20,
      searchData: val,
    });

    const values = {
      page: 1,
      limit: 20,
      ...val,
    };

    this.props.dispatch({
      type: 'data/fetchUser',
      payload: values,
    });
  };

  savePower = () => {
    let values = {};
    if (this.state.allChoosed[0] === 'all') {
      values = {
        userId: this.state.curUser,
        dataIds: 'all',
        appCode: appConfig.appShortCode,
      };
    } else {
      values = {
        userId: this.state.curUser,
        dataIds: this.state.allChoosed.join(','),
        dataNames: this.state.allChoosedName.join(','),
        appCode: appConfig.appShortCode,
      };
    }

    this.props.dispatch({
      type: 'data/fetchAdd',
      payload: values,
      uri: pageElement.btn_update.uri,
    });
    this.handleModalVisible();
  };

  render() {
    const {
      data: { userList, treeList, choosedList },
      landListLoading,
      treeLoading,
    } = this.props;
    const { limit, expandedKeys, searchTree, ifAll, page } = this.state;
    if (localStorage.menuKey) {
      const menuArr = localStorage.menuKey.split('/');
      if (menuArr[menuArr.length - 2].indexOf('base') > -1) {
        pageElement = getConfigElement('DataManager');
      } else {
        const real = `${menuArr[menuArr.length - 2].split('M')[0]}DataManager`;
        pageElement = getConfigElement(real);
      }
    }
    if (pageElement.btn_update) {
      pageElement.btn_edit = pageElement.btn_update;
    }
    const ifDis =
      (ifAll === 'init' && choosedList[0] === 'all') || ifAll === 'true';
    const loopPower = data =>
      data.map((item) => {
        const index = item.regionName.indexOf(searchTree);
        const beforeStr = item.regionName.substr(0, index);
        const afterStr = item.regionName.substr(index + searchTree.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchTree}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.regionName}</span>
          );
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.regionNum} title={title} disabled={ifDis}>
              {loopPower(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.regionNum} title={title} disabled={ifDis} />;
      });

    if (!this.state.controlCheck) {
      const choosedCopy = choosedList;
      const filter = data =>
        data.map((item) => {
          if (item.children && item.children.length) {
            const index = choosedCopy.indexOf(item.regionNum);
            if (index > -1) {
              choosedCopy.splice(index, 1);
            }
            filter(item.children);
          }
          return '';
        });
      filter(treeList);
      this.setState({
        hasChoosed: choosedCopy,
      });
    }
    return (
      <PageHeaderLayout title="数据权限管理">
        <div className="normalContent">
          <div className={styles.tableListForm}>
            <EvpSearchForm
              handleSearch={this.handleSearch}
              edit={this.edit}
              pageElement={pageElement}
            />
          </div>
          <div className={styles.dataTable}>
            <DataTable
              loading={landListLoading}
              data={userList}
              onChange={this.handleStandardTableChange}
              selectList={this.selectList}
              edit={this.edit}
              pageElement={pageElement}
              pageSize={limit}
              current={page}
            />
          </div>
        </div>

        <Modal
          title="修改权限"
          visible={this.state.modalVisible}
          destroyOnClose="true"
          width="300px"
          className={styles.modal}
          onCancel={() => this.handleModalVisible()}
          footer={null}
          style={{ top: '2vh' }}
          maskClosable={false}
        >
          <Spin spinning={treeLoading}>
            <div
              style={{
                height: '460px',
                overflow: 'hidden',
                overflowY: 'scroll',
              }}
            >
              {treeList.length ? (
                <Tree
                  checkable
                  checkedKeys={this.state.hasChoosed}
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onCheck={this.onCheck}
                >
                  <TreeNode key="all" title="全部" />
                  {loopPower(treeList)}
                </Tree>
              ) : (
                <p style={{ textAlign: 'center' }}>暂无可编辑权限</p>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={this.savePower}>
                保存
              </Button>
              <Button
                style={{ marginLeft: '10px' }}
                onClick={this.handleModalVisible}
              >
                取消
              </Button>
            </div>
          </Spin>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
