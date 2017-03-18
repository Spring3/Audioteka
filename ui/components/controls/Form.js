import React from 'react';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {this.props.children}
      </div>
    )
  }
}