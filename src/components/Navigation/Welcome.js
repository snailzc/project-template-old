import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Welcome.less';

export default class WelcomePage extends Component {
  state = {
  };

  equipmentClick = () => {
    alert('该跳转了');
    // this.props.dispatch(routerRedux.push('/bizManager/wlwbiz/myEquipment'))
  };

  render() {
    return (
      <div className={styles.body}>
        <div className={styles.card}>
          <Row gutter={16}>
            <Col span={8}>
              <Card title="Card title" bordered={false}>Card content</Card>
            </Col>
            <Col span={8}>
              <Card title="Card title" bordered={false}>Card content</Card>
            </Col>
            <Col span={8}>
              <Card title="Card title" bordered={false}>Card content</Card>
            </Col>
          </Row>
        </div>
        {/* 设备状态 */}
        <div className={styles.device}>
          <div>
            <span>设备状态</span>
            <span>总设备数:30</span>
          </div>
          <div>
            <p>
              <span>在线</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>10</span>
            </p>
            <p>
              <span>告警</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>20</span>
            </p>
            <p>
              <span>故障</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>50</span>
            </p>
            <p>
              <span>维修</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>25</span>
            </p>
          </div>
        </div>
        {/* 事件流程 */}
        <div className={styles.device}>
          <div>
            <span>事件流程</span>
            <span>总事件数:300</span>
          </div>
          <div>
            <p>
              <span>待处理</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>20</span>
            </p>
            <p>
              <span>处理中</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>50</span>
            </p>
            <p>
              <span>已处理</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>100</span>
            </p>
            <p />
          </div>
        </div>
        {/* 设备状态 */}
        <div className={styles.device}>
          <div>
            <span>设备状态</span>
            <span>总设备数:30</span>
          </div>
          <div>
            <p>
              <span>在线</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>10</span>
            </p>
            <p>
              <span>告警</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>20</span>
            </p>
            <p>
              <span>故障</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>50</span>
            </p>
            <p>
              <span>维修</span>
              <span className={styles.clickNum} onClick={this.equipmentClick.bind(this)}>25</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
