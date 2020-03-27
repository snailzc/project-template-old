import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Tree, Input, Modal, Select, Spin } from 'antd';
import MenuForm from '../../components/MenuForm';
import MenuTable from '../../components/MenuTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Menus.less';
import { getConfigElement, searlizeMenu } from '../../utils/utils';
import appConfig from '../../../config/app.config';


const { TreeNode } = Tree;
const { Option } = Select;
const { confirm } = Modal;
const FormItem = Form.Item;
let dataList = [];
let curResourcePrv = '';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const loop = (data, searchValue) =>
  data.map((item) => {
    const index = item.title.indexOf(searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + searchValue.length);
    const title =
      index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{item.title}</span>
      );
    if (item.children && item.children.length) {
      return (
        <TreeNode key={item.id} title={title}>
          {loop(item.children, searchValue)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.id} title={title} />;
  });
const generateList = (data) => {
  for (let i = 0; i < data.length; i += 1) {
    const node = data[i];
    const { id, title, parentId, appCode, require } = node;
    dataList.push({ id, title, parentId, appCode, require });
    if (node.children && node.children.length) {
      generateList(node.children);
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
const resultMenu = searlizeMenu();

// element config
let pageElement = {};

@connect(({ menu, loading }) => ({
  menu,
  resourceLoading: loading.effects['menu/queryResourceList'],
  treeMenuLoading: loading.effects['menu/fetch'],
}))
@Form.create()
export default class MenuManagePage extends PureComponent {
  state = {
    page: 1,
    limit: 20,
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    currentId: '',
    ifEdit: true,
    ifAdd: true,
    ifChoose: false,
    modalVisible: false,
    values: {
      hidePsd: false,
      code: '',
      menuId: '',
      method: '',
      name: '',
      type: '',
      uri: '',
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    /*     const urlHash = window.location.hash;
        const curApplication = urlHash.split('/')[2];

       resultMenu.forEach((item) => {
          if (item.code === curApplication) {
            localStorage.appcode = item.appCode;
            localStorage.curCode = item.appCode;
          }
        });*/
    dispatch({
      type: 'menu/fetch',
    });
    dispatch({
      type: 'menu/emptyMenuIdData',
    });
  }

  componentWillReceiveProps() {
    if (localStorage.ifMenuManager === 'true') {
      const { dispatch } = this.props;
      dispatch({
        type: 'menu/fetch',
      });
      dispatch({
        type: 'menu/emptyMenuIdData',
      });
      localStorage.ifMenuManager = 'false';
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: !this.state.autoExpandParent,
    });
  };

  onChange = (e) => {
    const { value } = e.target;
    const {
      menu: { treeMenu },
    } = this.props;
    generateList(treeMenu);
    const expandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.parentId, treeMenu);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onChangeSearch = (e) => {
    const { value } = e.target;
    this.setState({
      searchWord: value,
    });
  };

  handleEdit = () => {
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
  };

  handleDelete = () => {
    const that = this;
    confirm({
      title: '此操作将永久删除此菜单?',
      content: '',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.props.dispatch({
          type: 'menu/fetchDeleteMenu',
          payload: {
            id: that.state.currentId,
          },
          uri: pageElement.btn_del.uri,
        });

        localStorage.reset = 'true';
        that.setState({
          currentId: '',
          ifEdit: true,
          ifAdd: true,
          ifChoose: false,
        });
      },
      onCancel() {
        //
      },
    });
  };

  handleCancel = () => {
    const curId = this.state.currentId;
    localStorage.reset = 'true';

    if (curId) {
      this.props.dispatch({
        type: 'menu/fetchMenuId',
        payload: {
          id: curId,
        },
      });
      this.setState({
        currentId: curId,
        ifEdit: true,
        ifAdd: true,
        ifChoose: true,
      });
    } else {
      this.setState({
        ifEdit: true,
        ifAdd: true,
        ifChoose: false,
      });
    }

    this.props.dispatch({
      type: 'menu/queryResourceList',
      payload: {
        menuId: curId,
        page: this.state.page,
        limit: this.state.limit,
      },
    });
  };

  handleAdd = () => {
    this.props.dispatch({
      type: 'menu/emptyMenuId',
      payload: {
        id: this.state.currentId,
      },
    });
    this.setState({
      ifEdit: true,
      ifAdd: false,
    });
  };

  handleUpdate = (val) => {
    if (!this.state.ifAdd) {
      // add
      this.props.dispatch({
        type: 'menu/addMenu',
        payload: {
          appCode: appConfig.appShortCode,
          ...val,
        },
        uri: pageElement.btn_add.uri,
      });
    } else {
      const {
        menu: { menuIdData },
      } = this.props;
      // const data = Object.assign({}, menuIdData, val);
      const data = {
        ...menuIdData,
        ...val,
      };
      this.props.dispatch({
        type: 'menu/fetchPutMenu',
        payload: {
          appCode: appConfig.appShortCode,
          ...data,
        },
        uri: pageElement.btn_edit.uri,
      });
    }
    this.handleCancel();
  };

  handleResourceEdit = (text) => {
    this.setState({
      modalVisible: true,
      values: {
        code: text.code.split(':')[1],
        name: text.name,
        method: text.method.toUpperCase(),
        uri: text.uri,
        hidePsd: true,
        type: text.type.toUpperCase(),
        id: text.id,
      },
    });
  };

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
          parentId: '',
          uri: pageElement.btn_element_del.uri,
        });
      },
      onCancel() {
        // cancel
        that.setState({
          ifDelete: false,
        });
      },
    });
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      values: {
        hidePsd: false,
        code: '',
        menuId: '',
        method: '',
        name: '',
        type: '',
        uri: '',
      },
    });
  };

  handleAddElement = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
      };
      if (this.state.values.hidePsd) {
        // edit
        this.props.dispatch({
          type: 'menu/putElementById',
          payload: {
            ...values,
            id: this.state.values.id,
            menuId: this.state.currentId,
            appCode: appConfig.appShortCode,
            code: `${curResourcePrv}:${values.code}`,
          },
          uri: pageElement.btn_element_edit.uri,
        });
        this.setState({
          modalVisible: false,
        });
      } else {
        this.props.dispatch({
          type: 'menu/addElementById',
          payload: {
            ...values,
            menuId: this.state.currentId,
            appCode: appConfig.appShortCode,
            code: `${curResourcePrv}:${values.code}`,
          },
          uri: pageElement.btn_element_add.uri,
        });
        this.setState({
          modalVisible: false,
        });
      }
    });
  };

  handleSearch = (e) => {
    e.preventDefault();

    this.setState({
      page: 1,
      limit: 20,
    });

    const values = {
      page: 1,
      limit: 20,
      menuId: this.state.currentId,
      name: this.state.searchWord,
    };

    this.props.dispatch({
      type: 'menu/queryResourceList',
      payload: values,
    });
  };

  // 清空搜索栏
  handleReset = () => {
    this.setState({
      page: 1,
      limit: 20,
      searchWord: '',
    });
    const values = {
      page: 1,
      limit: 20,
      menuId: this.state.currentId,
      name: '',
    };
    this.props.dispatch({
      type: 'menu/queryResourceList',
      payload: values,
    });
  };

  handleMenuTableChange = (pagination) => {
    const { dispatch } = this.props;

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      menuId: this.state.currentId,
      name: this.state.searchWord,
    };

    this.setState({
      page: pagination.current,
      limit: pagination.pageSize,
    });

    dispatch({
      type: 'menu/queryResourceList',
      payload: params,
    });
  };

  selectNode = (key) => {
    dataList = [];
    const {
      menu: { treeMenu },
    } = this.props;
    generateList(treeMenu);
    if (key.length) {
      localStorage.reset = 'true';
      const curId = key[0];
      this.setState({
        currentId: curId,
        ifAdd: true,
        ifEdit: true,
        ifChoose: true,
      });

      this.props.dispatch({
        type: 'menu/fetchMenuId',
        payload: {
          id: curId,
        },
      });
      dataList.map((item) => {
        if (item.id === curId) {
          // localStorage.appcode = item.appCode;
          this.props.dispatch({
            type: 'menu/queryResourceList',
            payload: {
              menuId: curId,
              page: this.state.page,
              limit: this.state.limit,
            },
          });
        }
        return '';
      });
    }
  };

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
  };

  renderSearchForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: '-36px' }}>
          <Col md={10} sm={24} style={{ paddingRight: '0' }}>
            <FormItem label="资源名称">
              <Input
                style={{ width: '140px' }}
                size="small"
                value={this.state.searchWord}
                onChange={this.onChangeSearch}
              />
            </FormItem>
          </Col>
          <Col md={14} sm={24} style={{ paddingLeft: '0', marginTop: '9px' }}>
            <span className={styles.submitButtons}>
              <Button
                size="small"
                type="primary"
                htmlType="submit"
                className="ant-btn-plus-margin"
                icon="search"
              >
                查询
              </Button>
              <Button
                size="small"
                icon="reload"
                className="ant-btn-plus-margin"
                onClick={this.handleReset}
              >
                重置
              </Button>
              {pageElement && pageElement.btn_element_add ? (
                <Button
                  size="small"
                  type="primary"
                  icon="plus"
                  onClick={this.handleModalVisible}
                >
                  {pageElement.btn_element_add.name}
                </Button>
              ) : (
                ''
              )}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderSearch() {
    return this.renderSearchForm();
  }

  renderSimpleForm(menuIdData) {
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {pageElement && pageElement.btn_add ? (
            <Button
              type="primary"
              size="small"
              icon="plus"
              onClick={this.handleAdd}
              style={{ marginLeft: '24px', marginRight: '10px' }}
            >
              {pageElement.btn_add.name}
            </Button>
          ) : (
            ''
          )}
          {pageElement && pageElement.btn_edit && this.state.ifChoose ? (
            <Button
              type="dashed"
              size="small"
              icon="edit"
              onClick={this.handleEdit}
              style={{ marginRight: '10px' }}
            >
              {pageElement.btn_edit.name}
            </Button>
          ) : (
            ''
          )}
          {pageElement &&
          pageElement.btn_del &&
          menuIdData &&
          !menuIdData.require &&
          this.state.ifChoose ? (
            <Button
              type="danger"
              size="small"
              icon="delete"
              onClick={this.handleDelete}
              style={{ marginRight: '10px' }}
            >
              {pageElement.btn_del.name}
            </Button>
          ) : (
            ''
          )}
        </Row>
      </Form>
    );
  }

  renderForm(menuIdData) {
    return this.renderSimpleForm(menuIdData);
  }

  render() {
    const {
      menu: { treeMenu, resourceList },
      resourceLoading,
      treeMenuLoading,
    } = this.props;
    const { searchValue, expandedKeys, limit, page } = this.state;
    const { getFieldDecorator } = this.props.form;

    if (localStorage.menuKey) {
      const menuArr = localStorage.menuKey.split('/');
      if (menuArr[menuArr.length - 2].indexOf('base') > -1) {
        pageElement = getConfigElement('MenuManager');
      } else {
        const real = `${menuArr[menuArr.length - 2].split('M')[0]}MenuManager`;
        pageElement = getConfigElement(real);
      }
    }

    let { menuIdData } = this.props.menu;

    if (!menuIdData) {
      menuIdData = {
        code: '',
        title: '',
        parentId: '',
        icon: '',
        href: '',
        type: '',
        orderNum: '',
        description: '',
        require: '',
      };
      curResourcePrv = '';
    } else {
      curResourcePrv = menuIdData.code;
    }

    return (
      <PageHeaderLayout title="菜单管理">
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            {this.renderForm(menuIdData)}
          </div>
          <Row gutter={24} className={styles.menuRow}>
            <Col
              span={8}
              style={{
                position: 'absolute',
                top: '8px',
                left: 0,
                bottom: '8px',
                overflow: 'hidden',
                overflowY: 'scroll',
              }}
            >
              <Spin spinning={treeMenuLoading}>
                <Tree
                  defaultExpandAll
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onSelect={this.selectNode}
                >
                  {loop(treeMenu, searchValue)}
                </Tree>
              </Spin>
            </Col>
            <Col
              span={15}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: '8px',
                overflow: 'hidden',
                overflowY: 'scroll',
              }}
            >
              {!this.state.ifAdd || !this.state.ifEdit ? (
                <MenuForm
                  ifEdit={this.state.ifEdit}
                  ifAdd={this.state.ifAdd}
                  data={menuIdData}
                  handleCancel={this.handleCancel}
                  handleUpdate={this.handleUpdate}
                />
              ) : (
                ''
              )}
              <div
                style={{
                  display:
                    !this.state.ifAdd || this.state.edit ? 'none' : 'block',
                }}
              >
                <div className={styles.tableListForm}>
                  {this.renderSearch()}
                </div>
                <div className={styles.menuTable}>
                  <MenuTable
                    loading={resourceLoading}
                    data={resourceList}
                    onChange={this.handleMenuTableChange}
                    userEdit={this.handleResourceEdit}
                    userDelete={this.handleResourceDelete}
                    element={pageElement}
                    pageSize={limit}
                    current={page}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          title={this.state.values.hidePsd ? '编辑资源' : '新建资源'}
          visible={this.state.modalVisible}
          footer={null}
          destroyOnClose
          maskClosable={false}
          onCancel={() => this.handleModalVisible()}
        >
          <Form onSubmit={this.handleAddElement}>
            <FormItem {...formItemLayout} label="资源编码" key="form1">
              {getFieldDecorator('code', {
                initialValue: this.state.values.code,
                rules: [
                  {
                    required: true,
                    message: '请输入资源编码!',
                  },
                ],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="资源类型" key="form2">
              {getFieldDecorator('type', {
                initialValue: this.state.values.type,
                rules: [
                  {
                    required: true,
                    message: '请输入资源类型!',
                  },
                ],
              })(
                <Select>
                  <Option value="URI" key="URI">
                    URI
                  </Option>
                  <Option value="BUTTON" key="BUTTON">
                    BUTTON
                  </Option>
                  <Option value="HttpRestful" key="HttpRestful">
                    HttpRestful
                  </Option>
                  <Option value="WebService" key="WebService">
                    WebService
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="资源名称" key="form3">
              {getFieldDecorator('name', {
                initialValue: this.state.values.name,
                rules: [
                  {
                    required: true,
                    message: '请输入资源名称!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="资源地址" key="form4">
              {getFieldDecorator('uri', {
                initialValue: this.state.values.uri,
                rules: [
                  {
                    required: true,
                    message: '请输入资源地址!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="资源请求类型" key="form5">
              {getFieldDecorator('method', {
                initialValue: this.state.values.method,
                rules: [
                  {
                    required: true,
                    message: '请选择资源请求类型!',
                  },
                ],
              })(
                <Select>
                  <Option value="GET" key="GET">
                    GET
                  </Option>
                  <Option value="PUT" key="PUT">
                    PUT
                  </Option>
                  <Option value="POST" key="POST">
                    POST
                  </Option>
                  <Option value="DELETE" key="DELETE">
                    DELETE
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
              key="form6"
            >
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => this.handleModalVisible()}
              >
                取消
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
