import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isInViewport, debounce } from '../../utils';
import './index.less';

const { number, func } = PropTypes;

class LoadMore extends PureComponent {
  constructor(props) {
    super(props);
    this.index = LoadMore.count;
    this.unmount = false;
    this.state = { loading: false, error: false };
    LoadMore.count += 1;
  }

  static propTypes = {
    onShowMore: func.isRequired,
    offset: number,
  }

  static defaultProps = {
    offset: 20,
  }

  static instances = {}
  static count = 0

  static checkViewport() {
    Object.keys(LoadMore.instances).forEach(i => {
      const component = LoadMore.instances[i];
      if (component) component.checkViewport();
    });
  }

  loadData = () => {
    const { onShowMore } = this.props;
    this.setState({ loading: true, error: false });
    console.log('showmore');
    onShowMore().then(
      () => !this.unmount && this.setState({ loading: false, error: false }),
      () => !this.unmount && this.setState({ loading: false, error: true }),
    )
  }

  checkViewport = () => {
    const { offset } = this.props;
    const { root } = this.refs;
    const { loading, error } = this.state;
    if (!loading && !error && !this.unmount) {
      if (isInViewport(root, offset)) this.loadData();
    }
  }

  componentDidMount() {
    LoadMore.instances[this.index] = this;
    this.checkViewport();
  }

  componentWillUnmount() {
    // 卸载时，instances 移除当前实例
    delete LoadMore.instances[this.index];
    this.unmount = true;
  }

  render() {
    const { error } = this.state;
    return (
      <div className="load-more" ref="root">
        {!error && <i />}
        {error ?
          <span onClick={this.loadData}>加载失败，点击重试</span> :
          <span>正在加载中...</span>
        }
      </div>
    )
  }
}

const checkViewport = debounce(LoadMore.checkViewport, 200);
document.addEventListener('scroll', checkViewport, true);
document.addEventListener('transitionend', checkViewport, true);

export default LoadMore;
