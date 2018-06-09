import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './index.less';

export default class App extends Component {
  render() {
    return (
      <div className="index">
        index
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));