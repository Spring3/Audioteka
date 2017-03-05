import React from 'react';

export default class Label extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <label htmlFor={this.props.for} className={this.props.className}>{this.props.text}</label>;
  }
}