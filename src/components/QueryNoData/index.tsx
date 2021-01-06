import React, { Component } from 'react';
import { FolderOutlined, BugOutlined } from '@ant-design/icons';
import styles from './index.less';

export interface QueryNoDataProps {
  isError?: boolean;
  textContent?: string;
}

class QueryNoData extends Component<QueryNoDataProps, {}> {
  static defaultProps = {
    isError: false,
    textContent: '查询数据出错',
  };

  constructor(props: QueryNoDataProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { isError, textContent } = this.props;
    return (
      <div className={styles.noDataDiv}>
        <div className={styles.icon}>{isError ? <BugOutlined /> : <FolderOutlined />}</div>

        <div className={styles.text}>{textContent}</div>
      </div>
    );
  }
}

export default QueryNoData;
