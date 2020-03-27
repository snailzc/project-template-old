import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { searlizeMenu } from '../../utils/utils';

@connect(({ report }) => ({
  report,
}))
export default class Report extends PureComponent {
  state = {
  };

  componentDidMount() {
    const hrefArr = window.location.href.split('/');
    const curCode = hrefArr[hrefArr.length - 1];
    const { dispatch } = this.props;
    let uri = '';
    let uid = '';
    const allMenu = searlizeMenu();

    allMenu.map((item) => {
      if (item.code === curCode) {
        uri = item.url;
        uid = item.id;
      }
      return '';
    });

    dispatch({
      type: 'report/getUrl',
      payload: {
        uid,
        uri,
      },
      target: curCode,
    });
  }

  render() {
    const hrefArr = window.location.href.split('/');
    const curCode = hrefArr[hrefArr.length - 1];
    const { report } = this.props;
    const reportSrc = report[curCode];
    const routerData = JSON.parse(localStorage.routerData);
    const url = window.location.href.split('#')[1];
    // console.log(reportSrc, 'reportSrc');
    return (
      <PageHeaderLayout title={routerData[url] && routerData[url].title}>
        <iframe src={reportSrc} title={routerData[url] && routerData[url].title} id="Iframe" frameBorder="0" scrolling="auto" style={{ width: '100%', height: '100%', border: 0 }} />
      </PageHeaderLayout>
    );
  }
}
