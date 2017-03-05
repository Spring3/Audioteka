import React from 'react';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <button style={this.props.style} className={this.props.className || "btn btn-primary btn-block"} type={this.props.type}>{this.props.text}</button>;
  }
}