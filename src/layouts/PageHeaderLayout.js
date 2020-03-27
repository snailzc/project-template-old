import React from 'react';
import styles from './PageHeaderLayout.less';

export default ({ children, wrapperClassName, top, ...restProps }) => (
  <div style={{ margin: '0px' }} className={wrapperClassName}>
    {/* {top}
    <PageHeader {...restProps} linkElement={Link} /> */}
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);
