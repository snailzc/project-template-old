import React, { PureComponent } from 'react';
import { Popover } from 'antd';
import styles from './index.less';
import { menuList } from '../../../common/menu';

class FarmHeaderBiz extends PureComponent {
  state = {
    title: '',
    menu: '',
  };
  componentWillMount() {
    const menus = menuList ? menuList : false;
    const webTitle = sessionStorage.webTitle ? sessionStorage.webTitle : '牧原数字化养殖平台';
    if (menus[0]) {
      menus[0].children.map((item) => {
        if (item && item.title === '场长管理系统') {
          const main = item.children.filter((x) => {
            return x.title !== '基础配置管理' && x.title !== '数据接口';
          });
          this.setState({
            title: `${webTitle}使用手册`,
            menu: main,
          });
        }
      });
    }
  }

  threeLevelMenu = (data) => {
    const a = data.children.map((item) => {
      return (
        <p key={item.path}>{item.title}</p>
      );
    });
    return a;
  }


  render() {
    const { title, menu } = this.state;
    return (
      <div className={styles.main}>
        {
          title === '牧原场长管理系统使用手册' ? (
            <div className="scroll">
              <h2>{title}</h2>
              <div className={styles.content}>
                {
                  menu && menu.map(item => (
                    <div className={styles.flex} key={item.path}>
                      <div className="twoLevelMenu">
                        {item.title}
                      </div>
                      <div>
                        {
                          item && item.children && item.children.map(x => (
                            <div className={styles.flex} key={x.path}>
                              {
                                x && x.children && x.children[0] ? (
                                  <Popover placement="right" title={x.title} content={this.threeLevelMenu(x)} >
                                    <div className="threeLevelMenu">
                                      {x.title}
                                      <div className="line" />
                                    </div>
                                  </Popover>
                                ) : (
                                  <div className="threeLevelMenu">
                                    {x.title}
                                    <div className="line" />
                                  </div>
                                )
                              }
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
        ) : ''
      }
      </div>
    );
  }
}
export default FarmHeaderBiz;
