import React from 'react';
import { Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import { getRoutes } from '../utils/utils';
import { judgeUrl } from '../common/menu';


class UserLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hash: judgeUrl(`#${this.props.location.pathname}`),
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.state.props) {
      this.setState({
        hash: judgeUrl(`#${nextProps.location.pathname}`),
      });
    }
  }
  render() {
    const { routerData, match } = this.props;
    const { hash } = this.state;
    return (
      <DocumentTitle title={hash[0].title}>
        <div className={styles.container}>
          {
            getRoutes(match.path, routerData).map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )
          }

        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
