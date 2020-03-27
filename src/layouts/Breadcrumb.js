import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { menuList } from '../common/menu';
import styles from './Breadcrumb.less';

export default class BreadcrumbItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  getChildren = (data, type) => {
    if (Array.isArray(data)) {
      const routerData = localStorage.routerData && JSON.parse(localStorage.routerData);
      const arr = [];
      const url = type.split('/').map(i => i);
      url.pop();
      let typeItem = type;
      if (type.startsWith('/')) {
        typeItem = type.substr(1);
      }
      data.forEach((item) => {
        if (JSON.stringify(item).indexOf(typeItem) > -1 && typeItem) {
          arr.push({ href: item.href, name: item.name });
          if (item.children[0]) {
            arr.push(...this.getChildren(item.children, type));
          }
        }
      });
      if (!arr[0] && routerData[type] && typeItem) {
        arr.push(...this.getChildren(data, url.join('/')));
        const arrItem = arr.pop();
        arr.push({
          href: url.join('/'),
          name: arrItem.name,
          type: true,
        });
        arr.push({
          href: type,
          name: routerData[type].name,
        });
      }
      return arr;
    }
  }

  extraBreadcrumbItems = () => {
    return this.getChildren(menuList, this.props.location.pathname).map(item => (
      <Breadcrumb.Item key={item.href}>
        {
          item.type ? (
            <Link to={item.href}>{item.name}</Link>
          ) : (
            <span>{item.name}</span>
          )
        }

      </Breadcrumb.Item>
    ));
  }

  render() {
    const breadcrumbItems = [(
      <Breadcrumb.Item key="home">
        <Link to="/">首页</Link>
      </Breadcrumb.Item>
    )].concat(this.extraBreadcrumbItems());
    return (
      <div className={styles.Breadcrumb}>
        <Breadcrumb>
          {breadcrumbItems}
        </Breadcrumb>
      </div>
    );
  }
}

