import React from 'react';

export default class Label extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const type = this.props.type;
    let className = '';
    if (type) {
      className = `text-${type}`;
    }
    return <label htmlFor={this.props.for} className={className} style={this.props.style}>{this.props.text}</label>;
  }
}