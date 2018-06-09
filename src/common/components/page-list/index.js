import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmptyArray } from '../../utils';
import LoadMore from '../load-more';

const { bool, array, node, string, object, func } = PropTypes;

export default class PageList extends PureComponent {
  static propTypes = {
    children: node,
    err: object,
    emptyText: string,
    style: object,
    loading: bool,
    loadData: func,
    onShowMore: func,
    renderItem: func,
  }

  static defaultProps = {
    emptyText: '暂无内容',
    errorText: '出错了',
  }

  state = {
    loading: false,
    err: null,
    param: {
      pageNo: 1,
      pageSize: 10,
    },
    hasMore: true,
  }

  handleShowMore = () => {
    const { loadData } = this.props;
    const { param } = this.state;
    this.setState({ loading: true });
    return loadData(param).then(res => {
      const { param } = this.state;
      this.setState({
        loading: false,
        param: {
          ...param,
          pageNo: param.pageNo + 1,
        },
        hasMore: res.hasMore,
      });
    }).catch(err => {
      this.setState({ loading: false, err });
    });
  }

  renderFooter() {
    const { hasMore, err, loading } = this.state;
    if (hasMore === false) {
      return null;
    }
    return (
      <LoadMore error={loading ? null : err} loading={loading} onShowMore={this.handleShowMore} />
    );
  }

  renderError() {
    const { errorText } = this.props;
    const { loading, err } = this.state;
    return (
      <div>
        {err.message || errorText}
      </div>
    );
  }

  renderEmpty() {
    const { renderEmpty, emptyText } = this.props;
    if (renderEmpty) return renderEmpty();
    return (
      <div>
        {emptyText}
      </div>
    );
  }

  render() {
    console.log('page-list', this.state);
    const { param } = this.state;
    const { children, hasMore, loading, err, style } = this.props;
    if (!children && hasMore === false && !loading) return this.renderEmpty();
    if (err && param.pageNo === 1) return this.renderError();
    return (
      <div className="page-list" style={style}>
        {children}
        {this.renderFooter()}
      </div>
    );
  }
}
