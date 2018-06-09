import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getList } from './service';
import PageList from '../../common/components/page-list';
import Header from './components/header';
import ListItem from './components/list-item';

import './index.less';

export default class App extends Component {
  state = {
    data: [],
  }

  handleLoadData = (param) => {
    return getList(param).then(res => {
      if (param.pageNo === 1) {
        this.setState({ data: res.data.list });
      } else {
        this.setState({ data: [...this.state.data, ...res.data.list] })
      }
      return {
        hasMore: res.data.total > param.pageNo,
      }
    });
  }

  handleClickItem = (data) => {
    console.log('click', data);
  }

  render() {
    console.log('App', this.state);
    const { data } = this.state;
    return (
      <div className="index">
        <Header />
        <PageList loadData={this.handleLoadData}>
          {data.map(((item, i) => (
            <ListItem key={i} data={item} onClick={this.handleClickItem} />
          )))}
        </PageList>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
