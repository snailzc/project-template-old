import React, { PureComponent } from 'react';
import { Table, Row, Col, Button, Icon, Form, Input } from 'antd';
import styles from './index.less';
import { uniqueArray } from '../../utils/utils';

const FormItem = Form.Item;
const leaderColumns = [
  {
    title: '登录名',
    dataIndex: 'username',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
];
let choosedLeardersStr = '';
let choosedMembersStr = '';
const newChooseLearders = '';
let newChooseMembers = '';
const removeLearders = [];
let removeMembers = [];

const trimSpace = (array) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === '' || typeof (array[i]) === 'undefined') {
      array.splice(i, 1);
      i -= 1;
    }
  }
  return array;
};
const arrayFormat = (str1, str2) => {
  const newStr = `${str1},${str2}`;
  const arr = trimSpace(newStr.split(','));
  const data = uniqueArray(arr);

  return data.join(',');
};

class UserConnect extends PureComponent {
  state = {
    searchNotLinkWord: '',
    searchLinkedWord: '',
  };

  onChange = (e) => {
    const { value } = e.target;
    this.setState({
      searchNotLinkWord: value,
    });
  }

  onLinkedChange = (e) => {
    const { value } = e.target;
    this.setState({
      searchLinkedWord: value,
    });
  }

  // add learders fetch
  leardersAdd = () => {
    if (newChooseMembers || newChooseLearders) {
      this.props.handleLearderAdd(arrayFormat(choosedLeardersStr, newChooseLearders),
        arrayFormat(choosedMembersStr, newChooseMembers));
    }
  }

  membersAdd = () => {
    if (newChooseMembers || newChooseLearders) {
      this.props.handleLearderAdd(arrayFormat(choosedLeardersStr, newChooseLearders),
        arrayFormat(choosedMembersStr, newChooseMembers));
    }
  }

  leardersRemove = () => {
    if (removeLearders.length || removeMembers.length) {
      this.props.handleLearderRemove(removeLearders.join(','), removeMembers.join(','));
    }
  }

  handleTableLeaderChange = (pagination, filters, sorter) => {
    this.props.onLeaderChange(pagination, filters, sorter);
  }

  handleTableLeaderChooseChange = (pagination, filters, sorter) => {
    this.props.onLeaderChooseChange(pagination, filters, sorter);
  }

  handleTableMemberChange = (pagination, filters, sorter) => {
    this.props.onMemberChange(pagination, filters, sorter);
  }

  handleTableMemberChooseChange = (pagination, filters, sorter) => {
    this.props.onMemberChooseChange(pagination, filters, sorter);
  }

  handleNotLinkSearch = (e) => {
    e.preventDefault();

    this.props.getNotLinkUserByKeyWord(this.state.searchNotLinkWord);
  }

  handleLinkedSearch = (e) => {
    e.preventDefault();

    this.props.getLinkedUserByKeyWord(this.state.searchLinkedWord);
  }

  renderSimpleForm = () => {
    return (
      <Form onSubmit={this.handleNotLinkSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={14} sm={24} style={{ paddingRight: '0' }}>
            <FormItem label="关键字">
              <Input value={this.state.searchNotLinkWord} onChange={this.onChange} />
            </FormItem>
          </Col>
          <Col md={4} sm={24} style={{ paddingLeft: '0', marginTop: '3px' }}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderLink = () => {
    return (
      <Form onSubmit={this.handleLinkedSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={14} sm={24} style={{ paddingRight: '0' }}>
            <FormItem label="关键字">
              <Input value={this.state.searchLinkedWord} onChange={this.onLinkedChange} />
            </FormItem>
          </Col>
          <Col md={4} sm={24} style={{ paddingLeft: '0', marginTop: '3px' }}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderLinkedForm = () => {
    return this.renderLink();
  }

  renderForm = () => {
    return this.renderSimpleForm();
  }

  render() {
    const {
      data, loading,
      linkedLoading, oldDataIds,
      oldDataMember, curMemberTableParams,
      curMemberChooseTableParams,
    } = this.props;
    const userList = data.rows;
    choosedLeardersStr = oldDataIds.leaders;
    choosedMembersStr = oldDataIds.members;

    const paginationMembers = {
      total: data.total,
      pageSize: curMemberTableParams.limit,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const paginationMemberChoose = {
      total: oldDataIds.members.length,
      pageSize: curMemberChooseTableParams.limit,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    const rowSelectionMembers = {
      onChange: (selectedRowKeys) => {
        newChooseMembers = selectedRowKeys;
      },
    };
    const rowSelectionMembersChoose = {
      onChange: (selectedRowKeys) => {
        removeMembers = selectedRowKeys;
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
      }),
    };

    return (
      <Row gutter={40}>
        <Col md={10} sm={24} style={{ float: 'none', display: 'inline-block', verticalAlign: 'middle' }}>
          <h4 style={{ textAlign: 'center' }}>未关联用户列表</h4>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
          <Table
            loading={loading}
            rowKey={record => record.id}
            dataSource={userList}
            columns={leaderColumns}
            pagination={paginationMembers}
            rowSelection={rowSelectionMembers}
            onChange={this.handleTableMemberChange}
          />
        </Col>
        <Col md={3} style={{ display: 'inline-block', float: 'none', overflow: 'hidden', margin: '0 8px', verticalAlign: 'middle' }}>
          <Button type="primary" style={{ marginBottom: '10px' }} onClick={this.membersAdd}>增加<Icon type="right" /></Button>
          <Button type="danger" onClick={this.leardersRemove}><Icon type="left" />移除</Button>
        </Col>
        <Col md={10} sm={24} style={{ float: 'none', display: 'inline-block', verticalAlign: 'top' }}>
          <h4 style={{ textAlign: 'center' }}>已关联用户列表</h4>
          <div className={styles.tableListForm}>
            {this.renderLinkedForm()}
          </div>
          <Table
            loading={linkedLoading}
            rowKey={record => record.id}
            dataSource={oldDataMember.rows}
            columns={leaderColumns}
            pagination={paginationMemberChoose}
            rowSelection={rowSelectionMembersChoose}
            onChange={this.handleTableMemberChooseChange}
          />
        </Col>
      </Row>
    );
  }
}

export default UserConnect;
