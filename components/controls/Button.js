import React from 'react';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  click() {
    if (!this.props.onclick) {
      return console.error ('No handler for button');
    }
    this.props.onclick();
  }

  render() {
    return <button style={this.props.styles} onClick={this.click.bind(this)} className={this.props.className || "btn btn-primary btn-block"} type={this.props.type}>{this.props.text}</button>;
  }
}
