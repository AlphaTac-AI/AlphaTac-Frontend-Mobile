import React from 'react';
import './index.less';

export default class ListItem extends React.PureComponent {
  handleClick = () => {
    const { data, onClick } = this.props;
    if (onClick) onClick(data);
  }

  render() {
    const { data } = this.props;
    return (
      <div className="list-item">
        <div className="item-name">{data.name}</div>
        <div className="item-content">{data.time}</div>
      </div>
    );
  }
} 
