import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Tree, Modal, Tabs, message } from 'antd';
import classNames from 'classnames';
import GroupForm from '../../components/GroupForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PowerSimpleTable from '../../components/PowerSimpleTable';
import UserConnect from '../../components/UserConnect';
import styles from './Group.less';
import { getConfigElement, searlizeMenu } from '../../utils/utils';
import appConfig from '../../../config/app.config';


const FormItem = Form.Item;
const { TreeNode } = Tree;
const { confirm } = Modal;
const { TabPane } = Tabs;
const dataList = [];
let controlBtn = true;
let classString = classNames({
  [styles.hidden]: !controlBtn,
});
const Type = {
  INNERACCOUNT: 1,
  EXTERNALACCOUNT: 2,
  MANAGER: 0,
};

const generateList = (data, result) => {
  for (let i = 0; i < data.length; i += 1) {
    const node = data[i];
    const { id, name, parentId, type } = node;
    result.push({ id, name, parentId, type });
    if (node.children && node.children.length) {
      generateList(node.children, result);
    }
  }
};
const generateListPower = (data, result) => {
  for (let i = 0; i < data.length; i += 1) {
    const node = data[i];
    const { id, text, parentId } = node;
    result.push({ id, text, parentId });
    if (node.children && node.children.length) {
      generateListPower(node.children, result);
    }
  }
};
const getParentKey = (id, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children && node.children.length) {
      if (node.children.some(item => item.id === id)) {
        parentKey = node.id;
      } else if (getParentKey(id, node.children)) {
        parentKey = getParentKey(id, node.children);
      }
    }
  }
  return parentKey;
};

const getCurType = () => {
  let { curType } = localStorage;
  if (curType) {
    curType = Type[curType];
  } else {
    curType = '';
  }
  return curType;
};
const resultMenu = searlizeMenu();

// element config
let pageElement = {};

@connect(({ group, loading }) => ({
  group,
  userListLoading: loading.effects['group/fetchUser'],
  userLinkedLoading: loading.effects['group/fetchConnectUserMembers'],
  powerResourceLoading: loading.effects['group/fetchElementList'],
}))
@Form.create()
export default class MenuManagePage extends PureComponent {
  state = {
    page: 1,
    limit: 20,
    expandedKeys: [],
    searchValue: '',
    key: '',
    searchParent: '',
    expandedKeysPower: [],
    searchPowerValue: '',
    userModal: false,
    autoExpandParentPower: true,
    autoExpandParent: true,
    currentId: '',
    resourceModalTitle: '关联资源',
    userModalTitle: '关联用户',
    ifEdit: true,
    ifAdd: true,
    controlCheck: false,
    searchPowerListChoose: [],
    modalElement: false,
    simpleTable: true,
    curMemberTableParams: {
      page: 1,
      limit: 20,
    },
    curMemberChooseTableParams: {
      page: 1,
      limit: 20,
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const urlHash = window.location.hash;
    const curApplication = urlHash.split('/')[2];

    localStorage.curType = '';
   /* resultMenu.forEach((item) => {
      if (item.code === curApplication) {
        localStorage.appcode = item.appCode;
      }
    });*/

    dispatch({
      type: 'group/fetchTypeAll',
    });

    dispatch({
      type: 'group/emptyRoleIdData',
    });
  }

  componentWillReceiveProps() {
    if (localStorage.ifGroupManager === 'true') {
      const { dispatch } = this.props;
      dispatch({
        type: 'group/fetchTypeAll',
      });
      // dispatch({
      //   type: 'menu/fetch',
      // });
      dispatch({
        type: 'group/emptyRoleIdData',
      });
      localStorage.ifGroupManager = '';
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: !this.state.autoExpandParent,
    });
  }

  onExpandPower = (expandedKeysPower) => {
    this.setState({
      expandedKeysPower,
      autoExpandParentPower: !this.state.autoExpandParentPower,
    });
  }

  onCheck = (checkedKeys) => {
    this.setState({
      controlCheck: true,
      searchPowerListChoose: checkedKeys.checked,
    });
  }

  getNotLinkUserByKeyWord = (keyword) => {
    const curType = getCurType();

    this.props.dispatch({
      type: 'group/fetchUser',
      payload: {
        page: 1,
        limit: 20,
        name: keyword,
        id: this.state.currentId,
        type: curType,
      },
    });
  }

  getLinkedUserByKeyWord = (keyword) => {
    // get members data
    this.props.dispatch({
      type: 'group/fetchConnectUserMembers',
      payload: {
        page: 1,
        limit: 20,
        groupId: this.state.currentId,
        type: 1,
        keyword,
      },
    });
  }

  handleModalVisible = () => {
    this.setState({
      modalElement: false,
      userModal: false,
    });
  }
  onChangeGroup = (e) => {
    const { value } = e.target;
    this.setState({
      searchGroup: value,
    });
    // console.log(this.state.searchGroup, 'searchgroup key is --');
    this.props.dispatch({
      type: 'group/fetchTypeById',
      payload: {
        id: localStorage.currentKey,
        searchGroup: this.state.searchGroup,
      },
    });
  };
  tabChange = (key) => {
    // localStorage.clear();
    localStorage.currentKey = key;
    this.setState({
      ifEdit: true,
      ifAdd: true,
      currentId: '',
    });

    this.props.dispatch({
      type: 'group/fetchTypeById',
      payload: {
        id: key,
        searchGroup: this.state.searchGroup,
      },
    });
    this.props.dispatch({
      type: 'group/emptyRoleIdData',
    });
    controlBtn = true;
    classString = classNames({
      [styles.hidden]: !controlBtn,
    });
  }

  handlePower = () => {
    // localStorage.appcode = pageElement.view.appCode;
    const { dispatch } = this.props;
    const { currentId } = this.state;
    const that = this;
    // localStorage.removeItem('appcode');

    dispatch({
      type: 'group/fetchPowerMenu',
    })
      .then(() => {
        dispatch({
          type: 'group/fetchPowerMenuChoose',
          payload: {
            id: currentId,
          },
        }).then(() => {
          dispatch({
            type: 'group/emptyElementData',
          }).then(() => {
            that.setState({
              modalElement: true,
              controlCheck: false,
            });
          });
        });
      });
  }

  handlePowerUpdate = () => {
    this.props.dispatch({
      type: 'group/updatePowerMenu',
      payload: {
        id: this.state.currentId,
        tree: this.state.searchPowerListChoose.join(','),
      },
    });
    // this.setState({
    //   controlCheck: false,
    // });
  }

  handleConnect = () => {
    this.setState({
      userModal: true,
    });
    const curType = getCurType();

    // get
    this.props.dispatch({
      type: 'group/fetchUser',
      payload: {
        page: this.state.page,
        limit: this.state.limit,
        type: curType,
        name: '',
        id: this.state.currentId,
      },
    });

    // get members data
    this.props.dispatch({
      type: 'group/fetchConnectUserMembers',
      payload: {
        page: 1,
        limit: 20,
        groupId: this.state.currentId,
        type: 1,
        keyword: '',
      },
    });
  }

  handleLeadersAdd = (leaders, members) => {
    this.props.dispatch({
      type: 'group/updateConnectUser',
      payload: {
        id: this.state.currentId,
        members,
        leaders,
      },
    });
  }

  handleLeadersRemove = (leaders, members) => {
    this.props.dispatch({
      type: 'group/deleteConnectUser',
      payload: {
        id: this.state.currentId,
        members,
        leaders,
      },
    });
  }

  handleLeaderTableChange = (pagination) => {
    const curType = getCurType();
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
    };

    this.props.dispatch({
      type: 'group/fetchUser',
      payload: {
        ...params,
        type: curType,
        name: '',
        id: this.state.currentId,
      },
    });
  }

  handleLeaderChooseChange = () => {
    this.props.dispatch({
      type: 'group/fetchConnectUserLeaders',
      payload: {
        page: 1,
        limit: 20,
        groupId: this.state.currentId,
        type: 2,
        keyword: '',
      },
    });
  }

  handleMemberTableChange = (pagination) => {
    const curType = getCurType();
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
    };
    this.setState({
      curMemberTableParams: {
        ...params,
      },
    });
    this.props.dispatch({
      type: 'group/fetchUser',
      payload: {
        ...params,
        type: curType,
        name: '',
        id: this.state.currentId,
      },
    });
  }

  handleMemberChooseChange = (pagination) => {
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
    };
    this.setState({
      curMemberChooseTableParams: {
        ...params,
      },
    });
    this.props.dispatch({
      type: 'group/fetchConnectUserMembers',
      payload: {
        ...params,
        groupId: this.state.currentId,
        type: 1,
        keyword: '',
      },
    });
  }

  selectPowerNode = (key) => {
    localStorage.GroupChange = false;
    this.setState({
      simpleTable: false,
    });
    const { group: { searchPowerList } } = this.props;
    const allMenus = [];
    const generateListFunc = (data) => {
      for (let i = 0; i < data.length; i += 1) {
        const node = data[i];
        const { id, name, appCode } = node;
        allMenus.push({ id, name, appCode });
        if (node.children && node.children.length) {
          generateListFunc(node.children);
        }
      }
    };
    generateListFunc(searchPowerList);

    let curKey = '';
    if (key && key[0]) {
      [curKey] = key;
      this.setState({
        key: key[0],
      });
    } else {
      curKey = this.state.key;
    }

  /*  allMenus.forEach((item) => {
      if (item.id === curKey) {
        localStorage.appcode = item.appCode;
      }
    });*/

    this.props.dispatch({
      type: 'group/fetchElementList',
      payload: {
        id: curKey,
      },
    });
    this.props.dispatch({
      type: 'group/fetchChoosedMenuElement',
      payload: {
        id: this.state.currentId,
      },
    });
    this.setState({
      simpleTable: true,
    });
  }

  selectNode = (key) => {
    const { group: { typeList } } = this.props;
    controlBtn = true;
    classString = classNames({
      [styles.hidden]: !controlBtn,
    });
    localStorage.reset = 'true';
    generateList(typeList, dataList);
    const name = key[0];
    if (name) {
      for (let i = 0; i < dataList.length; i += 1) {
        if (dataList[i].id === name) {
          this.setState({
            currentId: dataList[i].id,
            currentName: dataList[i].name,
            resourceModalTitle: `${dataList[i].name}- 关联资源`,
            userModalTitle: `${dataList[i].name}- 关联用户`,
            ifEdit: true,
            ifAdd: true,
          });
          this.props.dispatch({
            type: 'group/fetchRoleId',
            payload: {
              id: dataList[i].id,
            },
          });
          break;
        }
      }
    } else {
      this.setState({
        ifEdit: true,
        ifAdd: true,
      });

      this.props.dispatch({
        type: 'group/fetchRoleId',
        payload: {
          id: this.state.currentId,
        },
      });
    }
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
    };

    this.setState({
      page: pagination.current,
      limit: pagination.pageSize,
    });

    dispatch({
      type: 'log/fetch',
      payload: params,
    });
  }

  handleResourceDelete = (text) => {
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: '确认删除此资源吗?',
      content: '',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.setState({
          ifDelete: true,
        });
        dispatch({
          type: 'menu/deleteElementById',
          payload: {
            id: text.id,
            menuId: that.state.currentId,
            page: 1,
            limit: 20,
          },
        });
      },
      onCancel() {
        // cancel
        that.setState({
          ifDelete: false,
        });
      },
    });
  }

  handleUpdate = (val) => {
    if (!this.state.ifEdit) {
      // edit
      const { group: { roleIdData } } = this.props;
      const data = Object.assign({}, roleIdData, val);
      this.props.dispatch({
        type: 'group/fetchPutGroup',
        payload: {
          appCode: a,
          ...data,
        },
      });
    } else {
      // add
      const data = {
        ...val,
        groupType: localStorage.currentKey,
        parentId: this.state.currentId ? this.state.currentId : '-1',
      };
      this.props.dispatch({
        type: 'group/fetchAddRole',
        payload: {
          appCode: appConfig.appShortCode,
          ...data,
        },
      });
    }
    this.handleCancel();
  }

  handleCancel = () => {
    localStorage.reset = 'true';
    this.setState({
      ifEdit: true,
      ifAdd: true,
    });
    if (this.state.currentId) {
      this.props.dispatch({
        type: 'group/fetchRoleId',
        payload: {
          id: this.state.currentId,
        },
      });
    }
  }

  handleDelete = () => {
    const that = this;
    confirm({
      title: '此操作将永久删除该角色?',
      content: '',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.props.dispatch({
          type: 'group/fetchDeleteRole',
          payload: {
            id: that.state.currentId,
          },
        });
        that.setState({
          currentId: '',
        });
        that.props.dispatch({
          type: 'group/emptyRoleIdData',
        });
      },
      onCancel() {
        //
      },
    });
  }

  handleAdd = () => {
    localStorage.reset = 'true';
    this.setState({
      ifAdd: false,
      ifEdit: true,
    });
    this.props.dispatch({
      type: 'group/emptyRoleIdData',
    });
  }

  handleEdit = () => {
    localStorage.reset = 'true';
    this.setState({
      ifEdit: false,
      ifAdd: true,
    });
    this.props.dispatch({
      type: 'menu/fetchMenuId',
      payload: {
        id: this.state.currentId,
      },
    });
    this.props.dispatch({
      type: 'group/fetchRoleId',
      payload: {
        id: this.state.currentId,
      },
    });
  }
  onChangeSearch = (val, target) => {
    this.setState({
      [target]: val,
    });
  };
  // 左侧搜索栏
  handleSearchParent = (e) => {
    e.preventDefault();
    this.props.dispatch({
      type: 'group/fetchTypeById',
      payload: {
        id: localStorage.currentKey,
        searchGroup: this.state.searchParent,
      },
    });
  };

  // 清空左侧搜索栏
  handleReset = () => {
    this.setState({
      page: 1,
      limit: 20,
      searchParent: '',
    });
    this.props.dispatch({
      type: 'group/fetchTypeById',
      payload: {
        id: localStorage.currentKey,
        searchGroup: '',
      },
    });
  };
  handleMenuTableChange = (pagination) => {
    const { dispatch } = this.props;

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      menuId: this.state.currentId,
    };

    this.setState({
      page: pagination.current,
      limit: pagination.pageSize,
    });

    dispatch({
      type: 'menu/resourceLoading',
      payload: params,
    });
  }

  elementChange = (record) => {
    if (record) {
      this.props.dispatch({
        type: 'group/updateElement',
        payload: {
          id: this.state.currentId,
          menuId: this.state.key,
          elementId: record.join(','),
        },
      });
    } else {
      message.warning('暂无选择资源');
    }

    // if (ifCheck) {
    //   // add
    //   this.props.dispatch({
    //     type: 'group/addMenuElement',
    //     payload: {
    //       id: this.state.currentId,
    //       menuId: record.menuId,
    //       elementId: record.id,
    //     },
    //   });
    // } else {
    //   this.props.dispatch({
    //     type: 'group/removeMenuElement',
    //     payload: {
    //       id: this.state.currentId,
    //       menuId: record.menuId,
    //       elementId: record.id,
    //     },
    //   });
    // }
  }

  renderForm(typeList) {
    return this.renderSimpleForm(typeList);
  }
  renderParentForm() {
    return this.renderParentSearchForm();
  }

  renderConnectUserModal(userListLoading, userLinkedLoading, allUserList,
    oldDataIds, userLeader, userMember, curMemberTableParams, curMemberChooseTableParams) {
    return (
      <UserConnect
        data={allUserList}
        oldDataIds={oldDataIds}
        oldDataLeader={userLeader}
        oldDataMember={userMember}
        loading={userListLoading}
        linkedLoading={userLinkedLoading}
        handleLearderAdd={this.handleLeadersAdd}
        handleLearderRemove={this.handleLeadersRemove}
        onLeaderChange={this.handleLeaderTableChange}
        onMemberChange={this.handleMemberTableChange}
        curMemberTableParams={curMemberTableParams}
        curMemberChooseTableParams={curMemberChooseTableParams}
        onLeaderChooseChange={this.handleLeaderChooseChange}
        onMemberChooseChange={this.handleMemberChooseChange}
        getNotLinkUserByKeyWord={this.getNotLinkUserByKeyWord}
        getLinkedUserByKeyWord={this.getLinkedUserByKeyWord}
      />
    );
  }

  renderSimpleForm(typeList) {
    return (
      <Form layout="inline" className={classString}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {
            pageElement && pageElement.btn_add ? <Button type="dashed" icon="plus" size="small" style={{ marginRight: '10px', marginLeft: '24px' }} onClick={this.handleAdd}>{ pageElement.btn_add.name }</Button> : ''
          }
          {
            pageElement && pageElement.btn_edit && this.state.currentId !== 'muyuan_role_root' && this.state.currentId && typeList.length ? <Button type="danger" size="small" style={{ marginRight: '10px' }} icon="edit" onClick={this.handleEdit}>{ pageElement.btn_edit.name }</Button> : ''
          }
          {
            pageElement && pageElement.btn_del && this.state.currentId !== 'muyuan_role_root' && this.state.currentId && typeList.length ? <Button type="danger" size="small" style={{ marginRight: '10px' }} icon="delete" onClick={this.handleDelete}>{ pageElement.btn_del.name }</Button> : ''
          }
          {
            pageElement && pageElement.btn_resourceManager && this.state.currentId && typeList.length ? <Button type="primary" size="small" style={{ marginRight: '10px' }} icon="exception" onClick={this.handlePower}>{ pageElement.btn_resourceManager.name }</Button> : ''
          }
          {
            pageElement && pageElement.btn_userManager && this.state.currentId && typeList.length ? <Button type="warning" size="small" style={{ marginRight: '10px' }} icon="user" onClick={this.handleConnect}>{ pageElement.btn_userManager.name }</Button> : ''
          }
        </Row>
      </Form>
    );
  }
  renderParentSearchForm() {
    return (
      <Form
        onSubmit={this.handleSearchParent}
        layout="inline"
        key="parentSearchKey"
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col style={{ paddingRight: '0', float: 'left' }}>
            <FormItem label="关键字">
              <Input
                size="small"
                value={this.state.searchParent}
                onChange={(e) => {
                  this.onChangeSearch(e.target.value, 'searchParent');
                }}
              />
            </FormItem>
          </Col>
          <Col style={{ paddingLeft: '0', marginTop: '6px' }}>
            <span className={styles.submitButtons}>
              <Button
                size="small"
                className="ant-btn-plus-margin"
                icon="search"
                type="primary"
                htmlType="submit"
              >
                查询
              </Button>
            </span>
            <span className={styles.submitButtons}>
              <Button size="small" icon="reload" onClick={this.handleReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { group: { typeList, typeAllList, roleIdData,
      allUserList, searchPowerList, powerElementsList,
      choosedMenuElementArr, userLeader, userMember },
    powerResourceLoading, userListLoading, userLinkedLoading } = this.props;
    const {
      searchValue, expandedKeys,
      searchPowerValue, expandedKeysPower,
      curMemberTableParams, curMemberChooseTableParams,
    } = this.state;
    const hasChoosedU = {
      leaders: [],
      members: [],
    };
    if (localStorage.menuKey) {
      const menuArr = localStorage.menuKey.split('/');
      if (menuArr[menuArr.length - 2].indexOf('base') > -1) {
        pageElement = getConfigElement('GroupManager');
      } else {
        const real = `${menuArr[menuArr.length - 2].split('M')[0]}GroupManager`;
        pageElement = getConfigElement(real);
      }
    }

    if (!this.state.controlCheck) {
      this.setState({
        searchPowerListChoose: this.props.group.searchPowerListChoose,
      });
    }

    if (userLeader && userLeader.rows) {
      const result = [];
      userLeader.rows.forEach((item) => {
        result.push(item.id);
      });
      hasChoosedU.leaders = result;
    }

    if (userMember && userMember.rows) {
      const result = [];
      userMember.rows.forEach((item) => {
        result.push(item.id);
      });
      hasChoosedU.members = result;
    }

    const loop = data => data.map((item) => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const name = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.name}</span>;
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.id} title={name}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={name} />;
    });
    const loopPower = data => data.map((item) => {
      const index = item.title.indexOf(searchPowerValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchPowerValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchPowerValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.id} title={title}>
            {loopPower(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={title} />;
    });

    return (
      <PageHeaderLayout title="角色权限管理">
        <div className={styles.tableList}>
          <Tabs defaultActiveKey="1" onChange={this.tabChange}>
            {
              typeAllList && typeAllList.length ? typeAllList.map((item) => {
                return <TabPane tab={item.name} key={item.id} />;
              }) : ''
            }
          </Tabs>
          <div className={styles.tableSearch}>
            {this.renderParentForm()}
          </div>
          <div className={styles.tableListForm}>
            {this.renderForm(typeList)}
          </div>
          <Row gutter={24} className={styles.rows}>
            <Col span={8} style={{ position: 'absolute', top: 0, left: 0, bottom: '10px', overflow: 'hidden', overflowY: 'scroll' }}>
        {/*      <FormItem label="关键字">
                <Input
                  size="small"
                  width="62"
                  value={this.state.searchGroup}
                  onChange={this.onChangeGroup}
                />
              </FormItem>*/}
              {
                typeList.length ? (
                  <Tree
                    defaultExpandAll
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onSelect={this.selectNode}
                  >
                    {loop(typeList)}
                  </Tree>
                ) : <p>暂无数据</p>

              }
            </Col>
            <Col span={15} style={{ position: 'absolute', top: 0, right: 0, bottom: '10px', overflow: 'hidden', overflowY: 'scroll' }}>
              <GroupForm
                ifEdit={this.state.ifEdit}
                currentId={this.state.currentId}
                currentName={this.state.currentName}
                ifAdd={this.state.ifAdd}
                data={roleIdData}
                handleCancel={this.handleCancel}
                handleUpdate={this.handleUpdate}
              />
            </Col>
          </Row>
        </div>
        <Modal
          title={this.state.resourceModalTitle}
          visible={this.state.modalElement}
          destroyOnClose="true"
          width="80%"
          onCancel={() => this.handleModalVisible()}
          key="connectElementModal"
          footer={null}
          className={styles.groupModal}
        >
          <Row gutter={24}>
            <Col span={8}>
              {
                this.state.currentId !== 'muyuan_role_root' && searchPowerList.length
                ? <Button type="primary" icon="exception" style={{ marginBottom: '16px' }} onClick={this.handlePowerUpdate}>保存菜单</Button>
                : ''
              }
              {
                searchPowerList.length ? (
                  <Tree
                    checkable={this.state.currentId !== 'muyuan_role_root'}
                    defaultExpandAll
                    checkedKeys={this.state.searchPowerListChoose}
                    checkStrictly
                    onExpand={this.onExpandPower}
                    expandedKeys={expandedKeysPower}
                    autoExpandParent={this.state.autoExpandParentPower}
                    onSelect={this.selectPowerNode}
                    onCheck={this.onCheck}
                  >
                    {loopPower(searchPowerList)}
                  </Tree>
                ) : <p>暂无数据</p>

              }

            </Col>
            <Col span={15}>
              {
                this.state.simpleTable
                ?
                  <PowerSimpleTable
                    curId={this.state.currentId}
                    data={powerElementsList}
                    loading={powerResourceLoading}
                    elementChange={this.elementChange}
                    choosedData={choosedMenuElementArr}
                  />
                : ''
              }

            </Col>
          </Row>
        </Modal>

        <Modal
          title={this.state.userModalTitle}
          visible={this.state.userModal}
          destroyOnClose="true"
          width="80%"
          footer={null}
          onCancel={() => this.handleModalVisible()}
        >
          {
            this.renderConnectUserModal(userListLoading, userLinkedLoading,
            allUserList, hasChoosedU, userLeader, userMember,
            curMemberTableParams, curMemberChooseTableParams)
          }
        </Modal>
      </PageHeaderLayout>
    );
  }
}
