import React from 'react';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.cols} style={this.props.styles}>
        {this.props.children}
      </div>
    );
  }
}
