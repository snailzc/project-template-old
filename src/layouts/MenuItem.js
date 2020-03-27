import React from 'react';
import { Card } from 'antd';
import styles from './MenuItem.less';

const { Meta } = Card;

class MenuItem extends React.PureComponent {
  render() {
    return (
      <div className={styles.menuMain}>
        <h2 className={styles.title}>管理菜单</h2>
        <div className={styles.menuList}>
          <Card
            hoverable
            style={{ width: 240 }}
          >
            <Meta
              description={<a href="http://www.baidu.com">基础配置管理</a>}
            />
          </Card>
        </div>
      </div>
    );
  }
}
export default MenuItem;
